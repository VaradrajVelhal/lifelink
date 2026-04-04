from django.urls import path
from .views import CreateRequestView, ListRequestsView, AcceptRequestView, CompleteRequestView

urlpatterns = [
    path('create/', CreateRequestView.as_view(), name='create-request'),
    path('list/', ListRequestsView.as_view(), name='list-requests'),
    path('<int:request_id>/accept/', AcceptRequestView.as_view(), name='accept-request'),
    path('<int:request_id>/complete/', CompleteRequestView.as_view(), name='complete-request'),
]