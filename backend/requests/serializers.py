from rest_framework import serializers
from .models import BloodRequest, OrganRequest

class BloodRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodRequest
        fields = '__all__'
        read_only_fields = ['hospital', 'status']

class OrganRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganRequest
        fields = '__all__'
        read_only_fields = ['hospital', 'status']