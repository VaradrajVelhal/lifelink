from django.apps import AppConfig


class BloodRequestsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blood_requests'
    label = 'requests'  # Keep migration label for backward compatibility

