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
        data = {
            "total_requests": 0,
            "pending_requests": 0,
            "total_donations": 0,
            "accepted_requests": 0
        }
        try:
            if request.user.role == 'hospital':
                data["total_requests"] = BloodRequest.objects.filter(hospital=request.user).count()
                data["pending_requests"] = BloodRequest.objects.filter(hospital=request.user, status='pending').count()
            elif request.user.role == 'donor':
                donor_profile = DonorProfile.objects.filter(user=request.user).first()
                if donor_profile:
                    data["total_donations"] = Donation.objects.filter(donor=donor_profile).count()
                
                # accepted_by is now a ForeignKey to User
                data["accepted_requests"] = BloodRequest.objects.filter(accepted_by=request.user, status='accepted').count()
        except Exception as e:
            # Log error if possible, but return safe data to prevent 500
            print(f"Stats Error: {e}")
        
        return Response(data)

class GlobalStatsView(APIView):
    permission_classes = []
    def get(self, request):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        data = {
            "total_donors": DonorProfile.objects.count(),
            "total_hospitals": User.objects.filter(role='hospital').count(),
            "successful_donations": BloodRequest.objects.filter(status='completed').count()
        }
        return Response(data)