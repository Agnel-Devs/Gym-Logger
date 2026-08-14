from django.shortcuts import render
from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import WorkoutSession
from .serializers import WorkoutSessionSerializer, UserRegisterSerializer


class WorkoutSessionViewSet(viewsets.ModelViewSet):
  serializer_class = WorkoutSessionSerializer

  def get_queryset(self):
    # Enforce scoping so users never see each other's data
    return WorkoutSession.objects.filter(owner=self.request.user)

  def perform_create(self, serializer):
    serializer.save(owner=self.request.user)


class RegisterView(generics.CreateAPIView):
  queryset = User.objects.all()
  permission_classes = (permissions.AllowAny,)
  serializer_class = UserRegisterSerializer


class UserDetailView(generics.RetrieveAPIView):
  permission_classes = (permissions.IsAuthenticated,)

  def get(self, request):
    return Response({
        'username': request.user.username,
        'email': request.user.email
    })


