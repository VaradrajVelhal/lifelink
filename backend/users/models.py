from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from donors.models import DonorProfile
from hospitals.models import HospitalProfile

class User(AbstractUser):
    ROLE_CHOICES = (
        ('donor', 'Donor'),
        ('hospital', 'Hospital'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=15)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'donor':
            DonorProfile.objects.create(user=instance)
        elif instance.role == 'hospital':
            HospitalProfile.objects.create(user=instance)