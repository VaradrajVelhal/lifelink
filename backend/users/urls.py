from django.urls import path
from .views import RegisterView, MyTokenObtainPairView, TokenRefreshView, LogoutView, UserInfoView, DashboardStatsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', UserInfoView.as_view(), name='user-info'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]