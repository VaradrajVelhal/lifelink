from rest_framework import serializers
from .models import DonorProfile, Donation

class DonorProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = DonorProfile
        fields = ['id', 'username', 'phone', 'blood_group', 'city', 'last_donation_date']

class DonationSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.username', read_only=True)
    donor_name = serializers.CharField(source='donor.user.username', read_only=True)

    class Meta:
        model = Donation
        fields = ['id', 'donor', 'donor_name', 'hospital', 'hospital_name', 'blood_group', 'date_donated']
        read_only_fields = ['donor']
