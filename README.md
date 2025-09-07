# Live Weather Dashboard

A full-stack weather dashboard with Django backend and React frontend, featuring user authentication and interactive weather charts.

## Project Structure

- `backend/` - Django REST API with JWT authentication
- `frontend/` - React frontend with Vite

## Features

- **User Authentication**: Login/Signup with JWT tokens
- **Weather Data**: Real-time weather from OpenWeatherMap API
- **Current Location**: Automatic weather detection for user's current location
- **Interactive Charts**: Line, Area, Bar, and Pie charts
- **Responsive Design**: Works on all devices
- **Dark Mode**: Toggle between light and dark themes
- **Search Suggestions**: Intelligent city search with autocomplete
- **Weather Alerts**: Real-time weather alerts and notifications
- **Search History**: Track and display previous searches

## Current Location Feature

The dashboard automatically detects and displays weather for your current location when you first visit the page:

1. **On Page Load**: The app requests location permission from your browser
2. **Automatic Detection**: If permission is granted, it fetches weather data for your current location
3. **Fallback**: If location access is denied or unavailable, it defaults to London weather
4. **Saved Preference**: Your last searched city is saved and loaded on subsequent visits
5. **Manual Override**: You can always search for any city manually using the search bar

### Location Permissions

- **First Visit**: Browser will ask for location permission
- **Permission Denied**: App will show London weather as fallback
- **Permission Granted**: Your current location weather will be displayed
- **Timeout**: If location detection takes too long, it falls back to London

## Setup Instructions

### Backend (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Start the Django server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Configuration

The frontend is configured to automatically detect the environment:
- **Development**: Uses `http://localhost:8000/api`
- **Production/Webcontainer**: Uses the webcontainer URL

The configuration is handled in `frontend/src/config.js`.

## Project Structure

```
Live Weather Dashboard/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/          # UI Components
│   │   ├── hooks/              # Custom React Hooks
│   │   ├── pages/              # Main Application Pages
│   │   ├── services/           # API and External Services
│   │   └── types/              # Type Definitions
│   └── package.json
├── backend/                     # Django Backend
│   ├── api/                    # Main API App
│   ├── users/                  # User Management
│   └── weather_backend/        # Django Settings
└── README.md
```

## API Endpoints

- `POST /api/signup/` - User registration
- `POST /api/login/` - User login
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/` - Update user profile

## Key Features

1. **Current Location Weather**: Automatic detection on page refresh
2. **City Search**: Intelligent search with suggestions
3. **Weather Comparison**: Compare multiple cities
4. **Interactive Charts**: Visualize weather trends
5. **User Authentication**: Secure login/signup system
6. **Search History**: Track previous searches
7. **Weather Alerts**: Real-time notifications
8. **Responsive Design**: Mobile-first approach
9. **Dark Mode**: Theme customization
10. **Real-time Updates**: Live weather data

For detailed project structure, see `PROJECT_STRUCTURE.md`. 