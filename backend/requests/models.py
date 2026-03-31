from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class BloodRequest(models.Model):
    BLOOD_GROUPS = (
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('fulfilled', 'Fulfilled'),
    )

    hospital = models.ForeignKey(User, on_delete=models.CASCADE)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUPS)
    units = models.IntegerField()
    city = models.CharField(max_length=100)
    urgency = models.CharField(max_length=20)  # normal / urgent
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.blood_group} needed at {self.city}"
    
class Notification(models.Model):
    donor = models.ForeignKey('donors.DonorProfile', on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.donor.user.username}"


class OrganRequest(models.Model):
    ORGAN_CHOICES = (
        ('Kidney', 'Kidney'),
        ('Liver', 'Liver'),
        ('Heart', 'Heart'),
        ('Lungs', 'Lungs'),
        ('Pancreas', 'Pancreas'),
        ('Corneas', 'Corneas'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('fulfilled', 'Fulfilled'),
    )

    hospital = models.ForeignKey(User, on_delete=models.CASCADE)
    organ_type = models.CharField(max_length=20, choices=ORGAN_CHOICES)
    city = models.CharField(max_length=100)
    urgency = models.CharField(max_length=20)  # normal / urgent
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.organ_type} needed at {self.hospital.username}"
