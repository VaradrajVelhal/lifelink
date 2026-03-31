from rest_framework import serializers
from .models import Donation

class DonationSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.username', read_only=True)

    class Meta:
        model = Donation
        fields = ['id', 'donor', 'hospital', 'hospital_name', 'blood_group', 'date_donated']
        read_only_fields = ['donor']
