from django.urls import path
from .views import RegisterView,LoginView,TestAuthView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/',LoginView.as_view()),
    path('test/', TestAuthView.as_view()),
]