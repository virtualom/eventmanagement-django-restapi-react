from django.contrib import admin
from .models import Event, Registration

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'event_date', 'capacity', 'organizer')
    list_filter = ('category', 'status', 'event_date')
    search_fields = ('title', 'location', 'description')

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('event', 'attendee', 'registered_at')
    list_filter = ('registered_at',)
    search_fields = ('event__title', 'attendee__username')
