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

    hospital = models.ForeignKey(User, on_delete=models.CASCADE)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUPS)
    units = models.IntegerField()
    city = models.CharField(max_length=100)
    urgency = models.CharField(max_length=20)  # normal / urgent
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
    
