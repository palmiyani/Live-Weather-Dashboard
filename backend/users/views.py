from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from .serializers import (
    UserSignupSerializer, UserLoginSerializer, UserProfileSerializer,
    WeatherSearchSerializer, WeatherAlertSerializer
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from .models import User, WeatherSearch, WeatherAlert
from rest_framework import serializers
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.

class SignupView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            serializer = UserSignupSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                return Response({
                    'message': 'User created successfully',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name
                    }
                }, status=status.HTTP_201_CREATED)
            else:
                # Return more detailed error messages
                error_messages = []
                for field, errors in serializer.errors.items():
                    for error in errors:
                        error_messages.append(f"{field}: {error}")
                return Response({
                    'message': 'Signup failed',
                    'errors': error_messages
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'message': 'Signup failed',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            data = request.data
            username_or_email = data.get('username')
            password = data.get('password')
            
            if not username_or_email or not password:
                return Response({
                    'detail': 'Username/email and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Try to authenticate by username first
            user = authenticate(username=username_or_email, password=password)
            
            # If username auth fails, try email
            if not user:
                try:
                    user_obj = User.objects.get(email=username_or_email)
                    user = authenticate(username=user_obj.username, password=password)
                except ObjectDoesNotExist:
                    user = None
            
            if user:
                login(request, user)
                # Update last login
                user.last_login = timezone.now()
                user.save()
                
                return Response({
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'is_verified': getattr(user, 'is_verified', False),
                        'default_city': getattr(user, 'default_city', ''),
                        'temperature_unit': getattr(user, 'temperature_unit', 'C')
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'detail': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except Exception as e:
            return Response({
                'detail': f'Server error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class WeatherSearchHistoryView(generics.ListCreateAPIView):
    serializer_class = WeatherSearchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WeatherSearch.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WeatherAlertView(generics.ListCreateAPIView):
    serializer_class = WeatherAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WeatherAlert.objects.filter(user=self.request.user, is_active=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WeatherAlertDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WeatherAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WeatherAlert.objects.filter(user=self.request.user)

class SendAlertEmailView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            data = request.data
            alert = data.get('alert', {})
            weather_data = data.get('weatherData', {})
            user_email = data.get('userEmail')
            
            if not user_email:
                return Response({'error': 'User email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create email subject and content
            subject = f"Weather Alert: {alert.get('city', 'Unknown City')}"
            
            # Create HTML content
            html_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">🚨 Weather Alert</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Your weather alert condition has been met!</p>
                </div>
                
                <div style="padding: 20px; background: #f8f9fa; border: 1px solid #dee2e6;">
                    <h2 style="color: #dc3545; margin-top: 0;">Alert Details</h2>
                    <p><strong>City:</strong> {alert.get('city', 'Unknown')}</p>
                    <p><strong>Condition:</strong> {alert.get('parameter', 'Unknown')} {alert.get('condition', '')} {alert.get('value', '')}{alert.get('unit', '')}</p>
                    
                    <h3 style="color: #495057; margin-top: 20px;">Current Weather</h3>
                    <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                        <p><strong>Temperature:</strong> {weather_data.get('temperature', 'N/A')}°C</p>
                        <p><strong>Humidity:</strong> {weather_data.get('humidity', 'N/A')}%</p>
                        <p><strong>Pressure:</strong> {weather_data.get('pressure', 'N/A')} hPa</p>
                        <p><strong>Wind Speed:</strong> {weather_data.get('windSpeed', 'N/A')} m/s</p>
                        <p><strong>Description:</strong> {weather_data.get('description', 'N/A')}</p>
                    </div>
                    
                    <p style="color: #6c757d; font-size: 14px; margin-top: 20px;">
                        This alert was triggered at {weather_data.get('timestamp', 'unknown time')}.
                    </p>
                </div>
                
                <div style="background: #e9ecef; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
                    <p style="margin: 0; color: #6c757d; font-size: 12px;">
                        This is an automated weather alert from your Weather Dashboard.
                    </p>
                </div>
            </div>
            """
            
            # Create plain text content
            text_content = strip_tags(html_content)
            
            # Send email
            send_mail(
                subject=subject,
                message=text_content,
                from_email=None,  # Uses DEFAULT_FROM_EMAIL
                recipient_list=[user_email],
                html_message=html_content,
                fail_silently=False,
            )
            
            return Response({'message': 'Alert email sent successfully'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SendTestEmailView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            data = request.data
            user_email = data.get('userEmail')
            
            if not user_email:
                return Response({'error': 'User email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            subject = "Test Email - Weather Dashboard"
            message = f"""
            Hello!
            
            This is a test email from your Weather Dashboard alert system.
            
            If you received this email, your email notifications are working correctly!
            
            Best regards,
            Weather Dashboard Team
            """
            
            send_mail(
                subject=subject,
                message=message,
                from_email=None,
                recipient_list=[user_email],
                fail_silently=False,
            )
            
            return Response({'message': 'Test email sent successfully'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': f'Failed to send test email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
