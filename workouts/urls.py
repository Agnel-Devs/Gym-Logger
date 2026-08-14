from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import WorkoutSessionViewSet, RegisterView, UserDetailView

router = DefaultRouter()
router.register(r'workouts', WorkoutSessionViewSet, basename='workout')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('users/me/', UserDetailView.as_view(), name='user-detail'),
] + router.urls