from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, Registration

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class EventSerializer(serializers.ModelSerializer):
    organizer_name = serializers.ReadOnlyField(source='organizer.username')
    registered_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('organizer', 'created_at')

    def get_registered_count(self, obj):
        return obj.registrations.count()

class RegistrationSerializer(serializers.ModelSerializer):
    event_title = serializers.ReadOnlyField(source='event.title')
    attendee_name = serializers.ReadOnlyField(source='attendee.username')

    class Meta:
        model = Registration
        fields = '__all__'
        read_only_fields = ('attendee', 'registered_at')
