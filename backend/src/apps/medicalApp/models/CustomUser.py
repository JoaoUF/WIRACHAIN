from django_extensions.db.models import ActivatorModel, TimeStampedModel
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

from .CustomUserManager import CustomUserManager


class CustomUser(AbstractUser, PermissionsMixin, ActivatorModel, TimeStampedModel):
    ROLE_ADMIN = 'admin'
    ROLE_CLINIC = 'clinic'
    ROLE_DOCTOR = 'doctor'
    ROLE_PATIENT = 'patient'
    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Admin'),
        (ROLE_CLINIC, 'Clinic'),
        (ROLE_DOCTOR, 'Doctor'),
        (ROLE_PATIENT, 'Patient'),
    ]

    username = None
    email = models.EmailField(_("email address"), unique=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_PATIENT)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager() # type: ignore