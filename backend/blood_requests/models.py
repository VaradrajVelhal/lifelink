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
        ('partially_filled', 'Partially Filled'),
        ('completed', 'Completed'),
    )

    hospital = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blood_requests')
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUPS)
    units = models.IntegerField()
    city = models.CharField(max_length=100)
    urgency = models.CharField(max_length=20)  # normal / urgent
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def accepted_count(self):
        """Number of donors who have accepted this request."""
        return self.acceptances.count()

    @property
    def is_fulfilled(self):
        """True when all requested units have been accepted by donors."""
        return self.accepted_count >= self.units

    def __str__(self):
        return f"{self.blood_group} needed at {self.city}"


class RequestAcceptance(models.Model):
    """
    Junction model tracking each donor's acceptance of a blood request.
    Allows multiple donors to accept the same request (up to `units` count).
    """
    blood_request = models.ForeignKey(
        BloodRequest,
        on_delete=models.CASCADE,
        related_name='acceptances'
    )
    donor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='request_acceptances'
    )
    accepted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # DB-level constraint: prevents duplicate acceptance
        unique_together = ('blood_request', 'donor')
        ordering = ['-accepted_at']

    def __str__(self):
        return f"{self.donor} accepted request #{self.blood_request_id}"
