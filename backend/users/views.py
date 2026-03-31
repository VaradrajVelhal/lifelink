from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=201)

        return Response(serializer.errors, status=400)
    
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "role": user.role,
                "is_admin": user.is_staff or user.is_superuser
            })

        return Response({"error": "Invalid credentials"}, status=401)
    
from rest_framework.permissions import IsAuthenticated

class TestAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Authenticated"})

from requests.models import BloodRequest, Notification, OrganRequest
from donors.models import Donation, DonorProfile
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated, IsAdminUser

User = get_user_model()

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'hospital':
            total_requests = BloodRequest.objects.filter(hospital=request.user).count()
            return Response({
                "total_requests": total_requests
            })
        elif request.user.role == 'donor':
            try:
                donor_profile = DonorProfile.objects.get(user=request.user)
                total_donations = Donation.objects.filter(donor=donor_profile).count()
                unread_notifications = Notification.objects.filter(donor=donor_profile, is_read=False).count()
            except DonorProfile.DoesNotExist:
                total_donations = 0
                unread_notifications = 0

            return Response({
                "total_donations": total_donations,
                "unread_notifications": unread_notifications
            })
            
        return Response({"error": "Unknown role"}, status=400)

class PlatformSummaryView(APIView):
    def get(self, request):
        total_donors = User.objects.filter(role='donor').count()
        total_hospitals = User.objects.filter(role='hospital').count()
        total_successful_matches = BloodRequest.objects.filter(status='fulfilled').count() + OrganRequest.objects.filter(status='fulfilled').count()
        return Response({
            "total_donors": total_donors,
            "total_hospitals": total_hospitals,
            "total_successful_matches": total_successful_matches
        })

class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        users = list(User.objects.exclude(is_superuser=True).values('id', 'username', 'email', 'role', 'date_joined'))
        
        # Add verified status
        from hospitals.models import HospitalProfile
        hospitals = HospitalProfile.objects.all().values_list('user_id', 'verified')
        hospital_dict = {user_id: verified for user_id, verified in hospitals}
        
        for u in users:
            if u['role'] == 'hospital':
                u['verified'] = hospital_dict.get(u['id'], False)
            else:
                u['verified'] = True # Donors don't have this

        
        # Pull blood and organ requests separately and combine
        blood_reqs = list(BloodRequest.objects.order_by('-created_at')[:5].values('id', 'blood_group', 'city', 'status', 'created_at', 'hospital__username'))
        for req in blood_reqs:
            req['type'] = 'Blood'
            req['item'] = req.pop('blood_group')
            
        organ_reqs = list(OrganRequest.objects.order_by('-created_at')[:5].values('id', 'organ_type', 'city', 'status', 'created_at', 'hospital__username'))
        for req in organ_reqs:
            req['type'] = 'Organ'
            req['item'] = req.pop('organ_type')

        recent_requests = blood_reqs + organ_reqs
        recent_requests.sort(key=lambda x: x['created_at'], reverse=True)

        today = timezone.now().date()
        daily_registrations = []
        for i in range(6, -1, -1):
            date = today - timedelta(days=i)
            count = User.objects.filter(date_joined__date=date).count()
            daily_registrations.append({"date": date.strftime('%b %d'), "count": count})

        return Response({
            "users": list(users),
            "recent_requests": recent_requests[:10],
            "daily_registrations": daily_registrations
        })