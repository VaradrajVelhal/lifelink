from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated
from requests.models import BloodRequest
from donors.models import DonorProfile, Donation

class RegisterView(APIView):
    permission_classes = []
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=201)
        return Response(serializer.errors, status=400)

class LoginView(APIView):
    permission_classes = []
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({
                "message": "Login successful",
                "username": user.username,
                "role": user.role,
                "is_admin": user.is_staff
            })
        return Response({"error": "Invalid credentials"}, status=401)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"})

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