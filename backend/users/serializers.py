from rest_framework import serializers
from .models import User
from donors.models import DonorProfile
from hospitals.models import HospitalProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['role'] = self.user.role
        data['is_admin'] = self.user.is_staff
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    blood_group = serializers.CharField(write_only=True, required=False)
    city = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'role', 'phone', 'blood_group', 'city']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):
        blood_group = validated_data.pop('blood_group', None)
        city = validated_data.pop('city', None)
        
        user = User.objects.create_user(**validated_data)
        
        # Signals already created the profiles, we just update them
        if user.role == 'donor':
            DonorProfile.objects.filter(user=user).update(
                blood_group=blood_group if blood_group else '',
                city=city if city else ''
            )
        elif user.role == 'hospital':
            HospitalProfile.objects.filter(user=user).update(
                city=city if city else '',
                hospital_name=user.username
            )
            
        return user