from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import BloodRequest
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
            # Hospitals see their own requests by default
            queryset = BloodRequest.objects.filter(hospital=request.user)
        else:
            # Donors see requests matching their own blood group and status 'pending' by default
            try:
                donor = DonorProfile.objects.get(user=request.user)
                queryset = BloodRequest.objects.filter(blood_group=donor.blood_group, status='pending')
            except DonorProfile.DoesNotExist:
                queryset = BloodRequest.objects.none()

        # Apply optional filters from query params
        if blood_group_param:
            queryset = queryset.filter(blood_group=blood_group_param)
        if city_param:
            queryset = queryset.filter(city__icontains=city_param)
        if status_param:
            queryset = queryset.filter(status=status_param)

        queryset = queryset.order_by('-created_at')
        serializer = BloodRequestSerializer(queryset, many=True)
        return Response(serializer.data)

class AcceptRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        if request.user.role != 'donor':
            return Response({"error": "Unauthorized"}, status=403)
        
        try:
            donor_profile = DonorProfile.objects.get(user=request.user)
            blood_request = BloodRequest.objects.get(id=request_id, status='pending')
            
            blood_request.status = 'accepted'
            blood_request.accepted_by = donor_profile
            blood_request.save()
            
            return Response({"message": "Request accepted successfully"})
        except (DonorProfile.DoesNotExist, BloodRequest.DoesNotExist):
            return Response({"error": "Request not found or already accepted"}, status=404)

class CompleteRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        if request.user.role != 'hospital':
            return Response({"error": "Unauthorized"}, status=403)

        try:
            blood_request = BloodRequest.objects.get(id=request_id, hospital=request.user, status='accepted')
            blood_request.status = 'completed'
            blood_request.save()
            return Response({"message": "Request marked as completed"})
        except BloodRequest.DoesNotExist:
            return Response({"error": "Request not found or not in accepted status"}, status=404)