from django.contrib import admin
from .models import BloodRequest

@admin.register(BloodRequest)
class BloodRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'blood_group', 'city', 'units', 'urgency', 'hospital', 'status', 'accepted_by')
    list_filter = ('status', 'blood_group', 'urgency')
    search_fields = ('city', 'hospital__username')