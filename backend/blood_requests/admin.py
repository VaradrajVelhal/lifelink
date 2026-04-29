from django.contrib import admin
from .models import BloodRequest, RequestAcceptance


class RequestAcceptanceInline(admin.TabularInline):
    model = RequestAcceptance
    extra = 0
    readonly_fields = ('donor', 'accepted_at')


@admin.register(BloodRequest)
class BloodRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'blood_group', 'city', 'units', 'urgency', 'hospital', 'status', 'get_accepted_count')
    list_filter = ('status', 'blood_group', 'urgency')
    search_fields = ('city', 'hospital__username')
    inlines = [RequestAcceptanceInline]

    @admin.display(description='Accepted')
    def get_accepted_count(self, obj):
        return obj.acceptances.count()


@admin.register(RequestAcceptance)
class RequestAcceptanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'blood_request', 'donor', 'accepted_at')
    list_filter = ('accepted_at',)
    search_fields = ('donor__username', 'blood_request__city')