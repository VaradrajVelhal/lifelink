from django.urls import path
from .views import DonorProfileView, ListDonationsView, CreateDonationView

urlpatterns = [
    path('profile/', DonorProfileView.as_view(), name='donor-profile'),
    path('donations/', ListDonationsView.as_view(), name='donor-donations'),
    path('donate/', CreateDonationView.as_view(), name='donor-donate'),
]
