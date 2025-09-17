<b>🌦️ Live Weather Dashboard </b>

A full-stack weather dashboard with a Django backend and React frontend, featuring user authentication, real-time weather updates, and interactive charts.

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

<b>✨ Features</b>

🔑 User Authentication: Secure signup/login with JWT tokens

🌍 Current Location Weather: Auto-detection of user’s weather

🔎 City Search: Intelligent search with autocomplete suggestions

📊 Interactive Charts: Line, Area, Bar, and Pie charts for weather trends

📱 Responsive Design: Works seamlessly across devices

🌙 Dark Mode: Toggle between light & dark themes

⏳ Search History: Track and revisit past searches

⚠️ Weather Alerts: Get real-time notifications for extreme conditions

🌐 Weather Comparison: Compare multiple cities in one view

📌 <b>Current Location Feature</b>

On first visit, the app asks for location permission

If granted, shows your location weather

If denied/unavailable, defaults to London weather

Saved preference: Last searched city is stored locally

Manual override: Search any city anytime<br>
<b>⚙️ Setup Instructions</b><br>
<b>🔹 Backend (Django)</b><br>

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

<b>🔹 Frontend (React with Vite)</b>

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

<b>🔗 API Configuration</b>

Development: http://localhost:8000/api

Production/Webcontainer: Uses deployed webcontainer URL

Configuration file: frontend/src/config.js
📡 <b>API Endpoints</b>
Method	Endpoint	Description
POST	/api/signup/	User registration
POST	/api/login/	User login
GET	/api/profile/	Fetch user profile
PUT	/api/profile/	Update user profile
🚀 <b>Key Highlights</b>

✅ Current Location Weather<br>
✅ City Search with Autocomplete<br>
✅ Weather Comparison
✅ Interactive Charts & Analytics
✅ Secure Authentication
✅ Search History Tracking
✅ Real-time Alerts
✅ Mobile-first & Responsive<br>
✅ Dark Mode Support<br>


<b>👨‍💻 Author</b>

<b>PAL MIYANI</b>

<b>GitHub: palmiyani</b>
