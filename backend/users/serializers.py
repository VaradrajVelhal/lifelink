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
    blood_group = serializers.CharField(write_only=True, required=False, allow_blank=True)
    city = serializers.CharField(write_only=True, required=False, allow_blank=True)
    full_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    hospital_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'role', 'phone', 'blood_group', 'city', 'full_name', 'hospital_name']
        extra_kwargs = {
            'username': {'required': False, 'allow_blank': True}
        }

    def validate(self, attrs):
        role = attrs.get('role')
        full_name = attrs.pop('full_name', None)
        hospital_name = attrs.pop('hospital_name', None)
        
        # Map full_name/hospital_name to username internally
        if role == 'donor' and full_name:
            attrs['username'] = full_name
        elif role == 'hospital' and hospital_name:
            attrs['username'] = hospital_name
            
        if not attrs.get('username'):
            raise serializers.ValidationError({"username": "Identification name is required."})
            
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "This name is already registered."})
            
        return attrs

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