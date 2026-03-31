from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class DonorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    blood_group = models.CharField(max_length=5)
    city = models.CharField(max_length=100)
    available = models.BooleanField(default=True)
    last_donation_date = models.DateField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.user.username

class Donation(models.Model):
    donor = models.ForeignKey(DonorProfile, on_delete=models.CASCADE)
    hospital = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'hospital'})
    blood_group = models.CharField(max_length=5)
    date_donated = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.donor.user.username} donated {self.blood_group} to {self.hospital.username}"

class OrganPledge(models.Model):
    ORGAN_CHOICES = (
        ('Kidney', 'Kidney'),
        ('Liver', 'Liver'),
        ('Heart', 'Heart'),
        ('Lungs', 'Lungs'),
        ('Pancreas', 'Pancreas'),
        ('Corneas', 'Corneas'),
    )
    donor = models.ForeignKey(DonorProfile, on_delete=models.CASCADE, related_name='organ_pledges')
    organ_type = models.CharField(max_length=20, choices=ORGAN_CHOICES)
    pledged_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.donor.user.username} pledged {self.organ_type}"