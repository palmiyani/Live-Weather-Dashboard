from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('weather-search/', views.WeatherSearchHistoryView.as_view(), name='weather-search'),
    path('weather-alerts/', views.WeatherAlertView.as_view(), name='weather-alerts'),
    path('weather-alerts/<int:pk>/', views.WeatherAlertDetailView.as_view(), name='weather-alert-detail'),
    path('send-alert-email/', views.SendAlertEmailView.as_view(), name='send-alert-email'),
    path('send-test-email/', views.SendTestEmailView.as_view(), name='send-test-email'),
] 