from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    """Custom User model for the weather dashboard"""
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    profile_picture = models.URLField(blank=True, null=True)
    
    # Weather preferences
    default_city = models.CharField(max_length=100, blank=True, null=True)
    temperature_unit = models.CharField(
        max_length=1, 
        choices=[('C', 'Celsius'), ('F', 'Fahrenheit')], 
        default='C'
    )
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.username

class WeatherSearch(models.Model):
    """Model to store user's weather search history"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weather_searches')
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, blank=True, null=True)
    temperature = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    humidity = models.IntegerField(null=True, blank=True)
    pressure = models.IntegerField(null=True, blank=True)
    wind_speed = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    description = models.CharField(max_length=200, blank=True, null=True)
    searched_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'weather_searches'
        ordering = ['-searched_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.city} ({self.searched_at})"

class WeatherAlert(models.Model):
    """Model to store user's weather alerts"""
    CONDITION_CHOICES = [
        ('temperature_above', 'Temperature Above'),
        ('temperature_below', 'Temperature Below'),
        ('humidity_above', 'Humidity Above'),
        ('humidity_below', 'Humidity Below'),
        ('pressure_above', 'Pressure Above'),
        ('pressure_below', 'Pressure Below'),
        ('wind_speed_above', 'Wind Speed Above'),
        ('wind_speed_below', 'Wind Speed Below'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weather_alerts')
    city = models.CharField(max_length=100)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    value = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=10, default='°C')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_triggered = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'weather_alerts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.city} {self.condition} {self.value}{self.unit}"
