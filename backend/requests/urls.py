from django.urls import path
from .views import CreateRequestView, CreateOrganRequestView, ListRequestsView, MarkAsReadView, MatchDonorsView, DonorNotificationsView, FulfillRequestView

urlpatterns = [
    path('create/', CreateRequestView.as_view()),
    path('create/organ/', CreateOrganRequestView.as_view()),
    path('<int:request_id>/match/', MatchDonorsView.as_view()),
    path('<int:request_id>/fulfill/', FulfillRequestView.as_view()),
    path('notifications/', DonorNotificationsView.as_view()),
    path('notifications/<int:notification_id>/read/', MarkAsReadView.as_view()),
    path('list/', ListRequestsView.as_view()),
]