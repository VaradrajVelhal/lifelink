from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class DonorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    blood_group = models.CharField(max_length=5)
    city = models.CharField(max_length=100)
    available = models.BooleanField(default=True)
    last_donation_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.username