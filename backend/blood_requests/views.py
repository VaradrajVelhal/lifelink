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
        if request.user.role == 'hospital':
            requests = BloodRequest.objects.filter(hospital=request.user).order_by('-created_at')
        else:
            # Donors see all pending requests for their city or all if they want
            requests = BloodRequest.objects.filter(status='pending').order_by('-created_at')
        
        serializer = BloodRequestSerializer(requests, many=True)
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