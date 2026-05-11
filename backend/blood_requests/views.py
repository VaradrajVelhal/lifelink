from backend import blood_requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db import transaction, IntegrityError
from django.db.models import Count
from .models import BloodRequest, RequestAcceptance
from .serializers import BloodRequestSerializer
from donors.models import DonorProfile


class CreateRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'hospital':
            return Response({"error": "Unauthorized"}, status=403)

        serializer = BloodRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(hospital=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class ListRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = request.user.role
        blood_group_param = request.query_params.get('blood_group')
        city_param = request.query_params.get('city')
        status_param = request.query_params.get('status')

        if role == 'hospital':
            # Hospitals see their own requests (all statuses)
            queryset = BloodRequest.objects.filter(hospital=request.user)
        else:
            # Donors see requests matching their blood group that still need donors
            try:
                donor = DonorProfile.objects.get(user=request.user)
                queryset = BloodRequest.objects.filter(
                    blood_group=donor.blood_group,
                    status__in=['pending', 'partially_filled']
                )
            except DonorProfile.DoesNotExist:
                queryset = BloodRequest.objects.none()

        # Apply optional filters from query params
        if blood_group_param:
            queryset = queryset.filter(blood_group=blood_group_param)
        if city_param:
            queryset = queryset.filter(city__icontains=city_param)
        if status_param:
            queryset = queryset.filter(status=status_param)

        # Annotate accepted_count for efficient serialization & prefetch donors
        queryset = queryset.annotate(
            accepted_count_annotation=Count('acceptances')
        ).prefetch_related(
            'acceptances__donor'
        ).order_by('-created_at')

        serializer = BloodRequestSerializer(queryset, many=True)
        return Response(serializer.data)


class AcceptRequestView(APIView):
    """
    Allows a donor to accept a blood request.
    Concurrency-safe: uses select_for_update() + unique_together constraint.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        if request.user.role != 'donor':
            return Response({"error": "Unauthorized"}, status=403)

        try:
            with transaction.atomic():
                # Lock the blood request row to prevent race conditions
                blood_request = BloodRequest.objects.select_for_update().get(id=request_id)

                # 1. Check request is still accepting donors
                if blood_request.status not in ('pending', 'partially_filled'):
                    return Response(
                        {"error": "This request is no longer accepting donors."},
                        status=status.HTTP_409_CONFLICT
                    )

                # 2. Check donor hasn't already accepted
                if RequestAcceptance.objects.filter(
                    blood_request=blood_request, donor=request.user
                ).exists():
                    return Response(
                        {"error": "You have already accepted this request."},
                        status=status.HTTP_409_CONFLICT
                    )

                # 3. Check slots are still available
                current_count = blood_request.acceptances.count()
                if current_count >= blood_request.units:
                    return Response(
                        {"error": "All units have been filled."},
                        status=status.HTTP_409_CONFLICT
                    )

                # 4. Create the acceptance record
                RequestAcceptance.objects.create(
                    blood_request=blood_request,
                    donor=request.user
                )

                # 5. Update status based on new count
                new_count = current_count + 1
                if new_count >= blood_request.units:
                    blood_request.status = 'completed'
                else:
                    blood_request.status = 'partially_filled'
                blood_request.save()

            return Response({
                "message": "Request accepted successfully.",
                "accepted_count": new_count,
                "units": blood_request.units
            })

        except BloodRequest.DoesNotExist:
            return Response(
                {"error": "Blood request not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except IntegrityError:
            # Fallback: unique_together constraint caught a duplicate
            return Response(
                {"error": "You have already accepted this request."},
                status=status.HTTP_409_CONFLICT
            )


class CompleteRequestView(APIView):
    """
    Allows a hospital to mark a request as completed.
    Only allowed when at least one donor has accepted (status = partially_filled).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        if request.user.role != 'hospital':
            return Response({"error": "Unauthorized"}, status=403)

        try:
            blood_request = BloodRequest.objects.get(
                id=request_id,
                hospital=request.user,
                status='partially_filled'
            )
            blood_request.status = 'completed'
            blood_request.save()
            return Response({"message": "Request marked as completed."})
        except BloodRequest.DoesNotExist:
            return Response(
                {"error": "Request not found or not in partially filled status."},
                status=status.HTTP_404_NOT_FOUND
            )