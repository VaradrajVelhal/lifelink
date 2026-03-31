from django.urls import path
from .views import RegisterView, LoginView, TestAuthView, DashboardStatsView, PlatformSummaryView, AdminDashboardView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('test/', TestAuthView.as_view()),
    path('dashboard-stats/', DashboardStatsView.as_view()),
    path('stats/', PlatformSummaryView.as_view()),
    path('admin-dashboard/', AdminDashboardView.as_view()),
]