from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import BloodRequest
from .serializers import BloodRequestSerializer
from donors.models import DonorProfile
from .models import Notification

class CreateRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'hospital':
            return Response({"error": "Only hospitals can create requests"}, status=403)

        serializer = BloodRequestSerializer(data=request.data)

        if serializer.is_valid():
            blood_request = serializer.save(hospital=request.user)
            
            from .tasks import process_blood_request
            process_blood_request.delay(blood_request.id)

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

class CreateOrganRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from .serializers import OrganRequestSerializer
        if request.user.role != 'hospital':
            return Response({"error": "Only hospitals can create requests"}, status=403)

        serializer = OrganRequestSerializer(data=request.data)

        if serializer.is_valid():
            organ_request = serializer.save(hospital=request.user)
            
            from .tasks import process_organ_request
            process_organ_request.delay(organ_request.id)

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    
class MatchDonorsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, request_id):
        if request.user.role != 'hospital':
            return Response({"error": "Only hospitals allowed"}, status=403)
        try:
            blood_request = BloodRequest.objects.get(id=request_id)
        except BloodRequest.DoesNotExist:
            return Response({"error": "Request not found"}, status=404)

        matched_donors = DonorProfile.objects.filter(
            blood_group=blood_request.blood_group,
            city=blood_request.city,
            available=True
        )

        data = []

        for donor in matched_donors:
            # Check if notification already exists
            already_sent = Notification.objects.filter(
                donor=donor,
                message__icontains=blood_request.city
            ).exists()

            if not already_sent:
                Notification.objects.create(
                    donor=donor,
                    message=f"Urgent need for {blood_request.blood_group} blood in {blood_request.city}"
                )

            data.append({
                "username": donor.user.username,
                "phone": donor.user.phone
            })

        return Response(data)
    
class DonorNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'donor':
            return Response({"error": "Only donors allowed"}, status=403)

        notifications = Notification.objects.filter(
            donor__user=request.user
        ).order_by('-created_at')

        data = []
        for n in notifications:
            data.append({
                "id": n.id,
                "message": n.message,
                "is_read": n.is_read
            })

        return Response(data)
    
class MarkAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id)
        except Notification.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        # security check
        if notification.donor.user != request.user:
            return Response({"error": "Unauthorized"}, status=403)

        notification.is_read = True
        notification.save()

        return Response({"message": "Marked as read"})
    
class ListRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'hospital':
            return Response({"error": "Only hospitals allowed"}, status=403)

        requests = BloodRequest.objects.filter(hospital=request.user).order_by('-id')
        serializer = BloodRequestSerializer(requests, many=True)


class FulfillRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        if request.user.role != 'hospital':
            return Response({"error": "Only hospitals allowed"}, status=403)

        try:
            blood_request = BloodRequest.objects.get(id=request_id, hospital=request.user)
        except BloodRequest.DoesNotExist:
            return Response({"error": "Request not found or not authorized"}, status=404)

        blood_request.status = 'fulfilled'
        blood_request.save()

        return Response({"message": "Request marked as fulfilled"})