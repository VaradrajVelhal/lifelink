from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class DonorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='donor_profile')
    blood_group = models.CharField(max_length=5)
    city = models.CharField(max_length=100)
    last_donation_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.blood_group})"

class Donation(models.Model):
    donor = models.ForeignKey(DonorProfile, on_delete=models.CASCADE, related_name='donations')
    hospital = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'hospital'})
    blood_group = models.CharField(max_length=5)
    date_donated = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.donor.user.username} donated to {self.hospital.username}"