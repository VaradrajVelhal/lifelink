from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Donation, DonorProfile
from .serializers import DonationSerializer

User = get_user_model()

class ListHospitalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'donor':
            return Response({"error": "Only donors can list hospitals"}, status=403)
        
        hospitals = User.objects.filter(role='hospital')
        data = [{"id": h.id, "name": h.username} for h in hospitals]
        return Response(data)

class CreateDonationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'donor':
            return Response({"error": "Only donors can log donations"}, status=403)
            
        try:
            donor_profile = DonorProfile.objects.get(user=request.user)
        except DonorProfile.DoesNotExist:
            return Response({"error": "Donor profile not found"}, status=404)

        serializer = DonationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(donor=donor_profile)
            return Response(serializer.data, status=201)
            
        return Response(serializer.errors, status=400)

class ListDonationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'donor':
            return Response({"error": "Only donors can view their donations"}, status=403)
        
        try:
            donor_profile = DonorProfile.objects.get(user=request.user)
        except DonorProfile.DoesNotExist:
            return Response({"error": "Donor profile not found"}, status=404)
            
        donations = Donation.objects.filter(donor=donor_profile).order_by('-date_donated')
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)

class PledgeOrganView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'donor':
            return Response({"error": "Only donors can pledge organs"}, status=403)
        try:
            donor_profile = DonorProfile.objects.get(user=request.user)
        except DonorProfile.DoesNotExist:
            return Response({"error": "Donor profile not found"}, status=404)
        
        organ_type = request.data.get('organ_type')
        if not organ_type:
            return Response({"error": "organ_type is required"}, status=400)
            
        from .models import OrganPledge
        OrganPledge.objects.filter(donor=donor_profile, organ_type=organ_type).delete()
        pledge = OrganPledge.objects.create(donor=donor_profile, organ_type=organ_type)
        return Response({"message": "Organ pledged successfully", "id": pledge.id}, status=201)
