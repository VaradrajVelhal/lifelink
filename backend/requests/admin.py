from django.contrib import admin
from .models import BloodRequest
from .models import Notification

@admin.register(BloodRequest)
class BloodRequestAdmin(admin.ModelAdmin):
    list_display = ('id','blood_group', 'city', 'units', 'urgency', 'hospital')


# admin.site.register(Notification)
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'message', 'created_at')