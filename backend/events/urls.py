from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    EventListCreateView,
    EventDetailView,
    RegisterForEventView,
    UnregisterFromEventView,
    EventAttendeesView,
    MyEventsView,
    MyRegistrationsView,
    DashboardStatsView,
)

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Events
    path('events/', EventListCreateView.as_view(), name='event_list_create'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event_detail'),
    path('events/<int:pk>/register/', RegisterForEventView.as_view(), name='event_register'),
    path('events/<int:pk>/unregister/', UnregisterFromEventView.as_view(), name='event_unregister'),
    path('events/<int:pk>/attendees/', EventAttendeesView.as_view(), name='event_attendees'),

    # User specific
    path('my-events/', MyEventsView.as_view(), name='my_events'),
    path('my-registrations/', MyRegistrationsView.as_view(), name='my_registrations'),
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard_stats'),
]
