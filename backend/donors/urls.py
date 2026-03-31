from django.urls import path
from .views import ListHospitalsView, CreateDonationView, ListDonationsView, PledgeOrganView

urlpatterns = [
    path('hospitals/', ListHospitalsView.as_view()),
    path('donate/', CreateDonationView.as_view()),
    path('donations/', ListDonationsView.as_view()),
    path('pledge-organ/', PledgeOrganView.as_view()),
]
