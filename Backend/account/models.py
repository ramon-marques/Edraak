from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    first_name = models.CharField(verbose_name='First name', max_length=30)
    last_name = models.CharField(verbose_name='Last name', max_length=30)
    email = models.EmailField(verbose_name='Email', max_length=255, unique=True)
    profile_image = models.ImageField(
        upload_to='user/images/',
        blank=True,
        null=True,
        )

    def get_full_name(self):
        full_name = f'{self.first_name} {self.last_name}'
        return full_name.strip()