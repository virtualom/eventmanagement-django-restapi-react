from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Event, Registration
from .serializers import UserSerializer, EventSerializer, RegistrationSerializer
from .permissions import IsOrganizerOrReadOnly, IsOrganizer
from django.contrib.auth.models import User

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'description', 'location']

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOrganizerOrReadOnly]

class RegisterForEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        
        if event.capacity <= event.registrations.count():
            return Response({'detail': 'Event is full'}, status=status.HTTP_400_BAD_REQUEST)
            
        if Registration.objects.filter(event=event, attendee=request.user).exists():
            return Response({'detail': 'Already registered'}, status=status.HTTP_400_BAD_REQUEST)
            
        Registration.objects.create(event=event, attendee=request.user)
        return Response({'detail': 'Successfully registered'}, status=status.HTTP_201_CREATED)

class UnregisterFromEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        registration = Registration.objects.filter(event=event, attendee=request.user)
        if registration.exists():
            registration.delete()
            return Response({'detail': 'Successfully unregistered'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'detail': 'Not registered for this event'}, status=status.HTTP_400_BAD_REQUEST)

class EventAttendeesView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrganizer]
    
    def get_queryset(self):
        event = get_object_or_404(Event, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, event)
        return Registration.objects.filter(event=event)

class MyEventsView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user).order_by('-created_at')

class MyRegistrationsView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        registrations = Registration.objects.filter(attendee=self.request.user)
        return Event.objects.filter(id__in=registrations.values_list('event_id', flat=True)).order_by('event_date')

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        my_events = Event.objects.filter(organizer=user)
        my_registrations = Registration.objects.filter(attendee=user)
        
        total_events_created = my_events.count()
        upcoming_events_created = my_events.filter(status='upcoming').count()
        total_registered = my_registrations.count()
        
        recent_events = list(my_events.order_by('-created_at')[:5])
        recent_registrations = list(my_registrations.order_by('-registered_at')[:5])
        
        recent_activity = []
        for e in recent_events:
            recent_activity.append({'type': 'created', 'title': e.title, 'date': e.created_at})
        for r in recent_registrations:
            recent_activity.append({'type': 'registered', 'title': r.event.title, 'date': r.registered_at})
            
        recent_activity.sort(key=lambda x: x['date'], reverse=True)
        
        return Response({
            'total_events_created': total_events_created,
            'upcoming_events_created': upcoming_events_created,
            'total_registered': total_registered,
            'recent_activity': recent_activity[:5]
        })
