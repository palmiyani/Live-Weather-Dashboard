from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, WeatherSearch, WeatherAlert

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_verified', 'created_at', 'last_login')
    list_filter = ('is_verified', 'is_staff', 'is_superuser', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Weather Dashboard', {
            'fields': ('phone_number', 'is_verified', 'profile_picture', 'default_city', 'temperature_unit')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Weather Dashboard', {
            'fields': ('phone_number', 'is_verified', 'profile_picture', 'default_city', 'temperature_unit')
        }),
    )

@admin.register(WeatherSearch)
class WeatherSearchAdmin(admin.ModelAdmin):
    list_display = ('user', 'city', 'country', 'temperature', 'humidity', 'searched_at')
    list_filter = ('searched_at', 'country')
    search_fields = ('user__username', 'city', 'country')
    ordering = ('-searched_at',)
    readonly_fields = ('searched_at',)

@admin.register(WeatherAlert)
class WeatherAlertAdmin(admin.ModelAdmin):
    list_display = ('user', 'city', 'condition', 'value', 'unit', 'is_active', 'created_at')
    list_filter = ('condition', 'is_active', 'created_at')
    search_fields = ('user__username', 'city')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'last_triggered')
