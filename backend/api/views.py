import requests
from django.http import JsonResponse
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, world!'})

@api_view(['GET'])
def get_minutely_rain(request):
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')
    if not lat or not lon:
        return JsonResponse({'error': 'lat and lon required'}, status=400)
    url = f'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude=hourly,daily,current,alerts&appid={settings.OPENWEATHER_API_KEY}&units=metric'
    resp = requests.get(url)
    if resp.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch data from OpenWeatherMap'}, status=500)
    return JsonResponse(resp.json())
