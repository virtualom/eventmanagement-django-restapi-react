# Event Management System

A full-stack Event Management System built with Django REST Framework and React.

## Features
- User Auth (Register/Login) via JWT
- CRUD Operations for Events
- Event Registration for Attendees
- Dashboard with Stats and Activity Feed
- Real-time Seat Availability Progress Bars
- Filtering & Search
- Dark Mode Premium UI

## Setup Instructions

### Backend
1. `cd backend`
2. `python -m venv venv`
3. Activate virtualenv: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. `pip install -r requirements.txt` (or install manually: django, djangorestframework, djangorestframework-simplejwt, django-cors-headers, django-filter)
5. `python manage.py makemigrations`
6. `python manage.py migrate`
7. `python manage.py createsuperuser` (Optional, for admin access)
8. `python manage.py runserver`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Technologies
- **Backend**: Django, DRF, SQLite
- **Frontend**: React (Vite), Tailwind CSS, Lucide React
- **Auth**: SimpleJWT
