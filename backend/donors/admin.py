from django.contrib import admin
from .models import DonorProfile, Donation

@admin.register(DonorProfile)
class DonorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'blood_group', 'city', 'last_donation_date')
    list_filter = ('blood_group', 'city')
    search_fields = ('user__username', 'city')

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('donor', 'hospital', 'blood_group', 'date_donated')
    list_filter = ('blood_group', 'date_donated')
    search_fields = ('donor__user__username', 'hospital__username')