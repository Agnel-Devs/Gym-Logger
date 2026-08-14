from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Exercise, WorkoutSession


class UserRegisterSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('username', 'password', 'email')
    extra_kwargs = {
        'password': {'write_only': True},
        'email': {'required': False, 'allow_blank': True}
    }

  def create(self, validated_data):
    user = User.objects.create_user(
        username=validated_data['username'],
        email=validated_data.get('email', ''),
        password=validated_data['password']
    )
    return user


class ExerciseSerializer(serializers.ModelSerializer):

  class Meta:
    model = Exercise
    fields = ['id', 'name', 'sets', 'reps', 'weight']


class WorkoutSessionSerializer(serializers.ModelSerializer):
  exercises = ExerciseSerializer(many=True)

  class Meta:
    model = WorkoutSession
    fields = ['id', 'date', 'notes', 'exercises']

  def create(self, validated_data):
    exercises_data = validated_data.pop('exercises')
    # Safely extract owner from validated_data or request context
    owner = validated_data.pop('owner', self.context['request'].user)
    session = WorkoutSession.objects.create(owner=owner, **validated_data)

    for exercise_data in exercises_data:
      Exercise.objects.create(session=session, **exercise_data)

    return session