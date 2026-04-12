from rest_framework import serializers
from .models import BloodRequest

class BloodRequestSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.username', read_only=True)
    donor_name = serializers.SerializerMethodField()
    donor_contact = serializers.SerializerMethodField()

    class Meta:
        model = BloodRequest
        fields = [
            'id', 'hospital', 'hospital_name', 'blood_group', 'units', 
            'city', 'urgency', 'status', 'accepted_by', 
            'donor_name', 'donor_contact', 'created_at'
        ]
        read_only_fields = ['hospital', 'status', 'accepted_by']

    def get_donor_name(self, obj):
        if obj.accepted_by:
            return obj.accepted_by.username
        return None

    def get_donor_contact(self, obj):
        if obj.accepted_by:
            return obj.accepted_by.phone
        return None