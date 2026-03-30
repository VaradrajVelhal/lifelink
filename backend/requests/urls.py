from django.urls import path
from .views import CreateRequestView, ListRequestsView, MarkAsReadView, MatchDonorsView, DonorNotificationsView

urlpatterns = [
    path('create/', CreateRequestView.as_view()),
    path('<int:request_id>/match/', MatchDonorsView.as_view()),
    path('notifications/', DonorNotificationsView.as_view()),
    path('notifications/<int:notification_id>/read/', MarkAsReadView.as_view()),
    path('list/', ListRequestsView.as_view()),
]