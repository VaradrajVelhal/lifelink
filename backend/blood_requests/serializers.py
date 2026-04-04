from rest_framework import serializers
from .models import BloodRequest

class BloodRequestSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.username', read_only=True)
    accepted_by_username = serializers.CharField(source='accepted_by.user.username', read_only=True, allow_null=True)

    class Meta:
        model = BloodRequest
        fields = ['id', 'hospital', 'hospital_name', 'blood_group', 'units', 'city', 'urgency', 'status', 'accepted_by', 'accepted_by_username', 'created_at']
        read_only_fields = ['hospital', 'status', 'accepted_by']