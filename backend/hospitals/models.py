from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class HospitalProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='hospital_profile')
    hospital_name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)

    def __str__(self):
        return self.hospital_name