from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class WorkoutSession(models.Model):
  owner = models.ForeignKey(
      User, on_delete=models.CASCADE, related_name='workout_sessions'
  )
  date = models.DateField(default=timezone.now)
  notes = models.TextField(blank=True, null=True)

  def __str__(self):
    return f"Workout on {self.date}"


class Exercise(models.Model):
  session = models.ForeignKey(
      WorkoutSession, on_delete=models.CASCADE, related_name='exercises'
  )
  name = models.CharField(max_length=100)
  sets = models.PositiveIntegerField()
  reps = models.PositiveIntegerField()
  weight = models.DecimalField(
      max_digits=5, decimal_places=2, help_text='Weight in kg or lbs'
  )

  def __str__(self):
    return (
        f"{self.name} - {self.sets} sets x {self.reps} reps @ {self.weight}"
    )