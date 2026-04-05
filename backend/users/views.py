from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from blood_requests.models import BloodRequest
from donors.models import DonorProfile, Donation

class RegisterView(APIView):
    permission_classes = []
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=201)
        return Response(serializer.errors, status=400)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        # JWT is stateless; logout is handled on frontend by clearing tokens.
        return Response({"message": "Successfully logged out"})

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({
            "username": request.user.username,
            "role": request.user.role,
            "email": request.user.email,
            "phone": request.user.phone
        })

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {}
        if request.user.role == 'hospital':
            data["total_requests"] = BloodRequest.objects.filter(hospital=request.user).count()
            data["pending_requests"] = BloodRequest.objects.filter(hospital=request.user, status='pending').count()
        elif request.user.role == 'donor':
            try:
                donor_profile = DonorProfile.objects.get(user=request.user)
                data["total_donations"] = Donation.objects.filter(donor=donor_profile).count()
                data["accepted_requests"] = BloodRequest.objects.filter(accepted_by=donor_profile, status='accepted').count()
            except DonorProfile.DoesNotExist:
                data["total_donations"] = 0
                data["accepted_requests"] = 0
        
        return Response(data)