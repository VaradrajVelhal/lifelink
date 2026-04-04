from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Donation, DonorProfile
from .serializers import DonationSerializer, DonorProfileSerializer

class DonorProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = DonorProfile.objects.get(user=request.user)
            serializer = DonorProfileSerializer(profile)
            return Response(serializer.data)
        except DonorProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)

    def post(self, request):
        profile, created = DonorProfile.objects.get_or_create(user=request.user)
        serializer = DonorProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class ListDonationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'donor':
            return Response({"error": "Unauthorized"}, status=403)
        
        try:
            donor_profile = DonorProfile.objects.get(user=request.user)
            donations = Donation.objects.filter(donor=donor_profile).order_by('-date_donated')
            serializer = DonationSerializer(donations, many=True)
            return Response(serializer.data)
        except DonorProfile.DoesNotExist:
            return Response([])

class CreateDonationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'donor':
            return Response({"error": "Unauthorized"}, status=403)
            
        try:
            donor_profile = DonorProfile.objects.get(user=request.user)
            serializer = DonationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(donor=donor_profile)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        except DonorProfile.DoesNotExist:
            return Response({"error": "Donor profile check failed"}, status=404)
