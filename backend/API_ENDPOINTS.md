# Django REST API Endpoints

## Base URL: http://localhost:8000/api/

## Authentication Endpoints

### 1. User Registration
- **URL:** `/users/signup/`
- **Method:** POST
- **Description:** Register a new user
- **Request Body:**
```json
{
    "username": "user123",
    "email": "user@example.com",
    "password": "password123",
    "confirm_password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890"
}
```

### 2. User Login
- **URL:** `/users/login/`
- **Method:** POST
- **Description:** Authenticate user and create session
- **Request Body:**
```json
{
    "username": "user123",
    "password": "password123"
}
```

### 3. User Logout
- **URL:** `/users/logout/`
- **Method:** POST
- **Description:** Logout user and destroy session
- **Authentication:** Required

### 4. User Profile
- **URL:** `/users/profile/`
- **Method:** GET, PUT, PATCH
- **Description:** Get or update user profile
- **Authentication:** Required

## Weather Data Endpoints

### 5. Weather Search History
- **URL:** `/users/weather-search/`
- **Method:** GET, POST
- **Description:** Get user's weather search history or add new search
- **Authentication:** Required
- **Request Body (POST):**
```json
{
    "city": "London",
    "country": "UK",
    "temperature": 20.5,
    "humidity": 65,
    "pressure": 1013,
    "wind_speed": 5.2,
    "description": "Partly cloudy"
}
```

### 6. Weather Alerts
- **URL:** `/users/weather-alerts/`
- **Method:** GET, POST
- **Description:** Get user's weather alerts or create new alert
- **Authentication:** Required
- **Request Body (POST):**
```json
{
    "city": "London",
    "condition": "temperature_above",
    "value": 25.0,
    "unit": "°C"
}
```

### 7. Weather Alert Detail
- **URL:** `/users/weather-alerts/{id}/`
- **Method:** GET, PUT, PATCH, DELETE
- **Description:** Get, update, or delete specific weather alert
- **Authentication:** Required

## Email Notifications

### 8. Send Alert Email
- **URL:** `/users/send-alert-email/`
- **Method:** POST
- **Description:** Send weather alert email notification
- **Request Body:**
```json
{
    "userEmail": "user@example.com",
    "alert": {
        "city": "London",
        "parameter": "Temperature",
        "condition": "above",
        "value": 25,
        "unit": "°C"
    },
    "weatherData": {
        "temperature": 27.5,
        "humidity": 60,
        "pressure": 1013,
        "windSpeed": 3.2,
        "description": "Sunny",
        "timestamp": "2024-01-15T10:30:00Z"
    }
}
```

### 9. Send Test Email
- **URL:** `/users/send-test-email/`
- **Method:** POST
- **Description:** Send test email to verify email configuration
- **Request Body:**
```json
{
    "userEmail": "user@example.com"
}
```

## Database Models

### User Model
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password
- `first_name` - User's first name
- `last_name` - User's last name
- `phone_number` - Optional phone number
- `is_verified` - Email verification status
- `created_at` - Account creation timestamp
- `last_login` - Last login timestamp
- `profile_picture` - URL to profile picture
- `default_city` - User's default city
- `temperature_unit` - Preferred temperature unit (C/F)

### WeatherSearch Model
- `user` - Foreign key to User
- `city` - City name
- `country` - Country name
- `temperature` - Temperature value
- `humidity` - Humidity percentage
- `pressure` - Pressure in hPa
- `wind_speed` - Wind speed in m/s
- `description` - Weather description
- `searched_at` - Search timestamp

### WeatherAlert Model
- `user` - Foreign key to User
- `city` - City to monitor
- `condition` - Alert condition type
- `value` - Threshold value
- `unit` - Unit of measurement
- `is_active` - Alert status
- `created_at` - Alert creation timestamp
- `last_triggered` - Last trigger timestamp

## Usage Examples

### Frontend Integration

```javascript
// Login example
const loginUser = async (username, password) => {
    const response = await fetch('http://localhost:8000/api/users/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });
    return response.json();
};

// Get user profile
const getUserProfile = async () => {
    const response = await fetch('http://localhost:8000/api/users/profile/', {
        credentials: 'include'
    });
    return response.json();
};

// Save weather search
const saveWeatherSearch = async (weatherData) => {
    const response = await fetch('http://localhost:8000/api/users/weather-search/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(weatherData)
    });
    return response.json();
};
```

## Admin Interface

Access the Django admin interface at: http://localhost:8000/admin/

Login with the superuser credentials to manage:
- Users
- Weather Searches
- Weather Alerts

## CORS Configuration

The API is configured to allow requests from:
- http://localhost:5173 (Vite dev server)
- http://localhost:5174
- http://localhost:5175
- http://localhost:5176
- http://127.0.0.1:5173
- http://127.0.0.1:5174
- http://127.0.0.1:5175
- http://127.0.0.1:5176 