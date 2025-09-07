from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_world, name='hello_world'),
    path('minutely-rain/', views.get_minutely_rain, name='minutely_rain'),
] 