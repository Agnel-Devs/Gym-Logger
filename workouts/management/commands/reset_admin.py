from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import os

class Command(BaseCommand):
    help = 'Creates or updates a superuser using ADMIN_USERNAME and ADMIN_PASSWORD environment variables'

    def handle(self, *args, **options):
        username = os.environ.get('ADMIN_USERNAME', 'admin')
        password = os.environ.get('ADMIN_PASSWORD')
        
        if not password:
            self.stdout.write(self.style.ERROR('ADMIN_PASSWORD environment variable is not set.'))
            return
            
        user, created = User.objects.get_or_create(username=username)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        
        status = 'created' if created else 'updated'
        self.stdout.write(self.style.SUCCESS(f'Admin user "{username}" password reset successfully ({status}).'))
