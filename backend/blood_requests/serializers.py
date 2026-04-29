from rest_framework import serializers
from .models import BloodRequest, RequestAcceptance


class RequestAcceptanceSerializer(serializers.ModelSerializer):
    """Serializes each donor acceptance with donor details."""
    donor_name = serializers.CharField(source='donor.username', read_only=True)
    donor_contact = serializers.CharField(source='donor.phone', read_only=True)

    class Meta:
        model = RequestAcceptance
        fields = ['id', 'donor', 'donor_name', 'donor_contact', 'accepted_at']
        read_only_fields = ['id', 'donor', 'accepted_at']


class BloodRequestSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.username', read_only=True)
    acceptances = RequestAcceptanceSerializer(many=True, read_only=True)
    accepted_count = serializers.IntegerField(read_only=True, source='accepted_count_annotation', default=0)
    is_fulfilled = serializers.SerializerMethodField()

    class Meta:
        model = BloodRequest
        fields = [
            'id', 'hospital', 'hospital_name', 'blood_group', 'units',
            'city', 'urgency', 'status', 'acceptances',
            'accepted_count', 'is_fulfilled', 'created_at'
        ]
        read_only_fields = ['hospital', 'status']

    def get_is_fulfilled(self, obj):
        # Use annotated count if available, otherwise fall back to property
        count = getattr(obj, 'accepted_count_annotation', None)
        if count is not None:
            return count >= obj.units
        return obj.is_fulfilled