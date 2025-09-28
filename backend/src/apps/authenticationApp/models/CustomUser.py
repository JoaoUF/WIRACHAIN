from django_extensions.db.models import ActivatorModel, TimeStampedModel
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from phonenumber_field.modelfields import PhoneNumberField

from .CustomUserManager import CustomUserManager
from ..validators import validate_age_minimum


class CustomUser(AbstractUser, PermissionsMixin, ActivatorModel, TimeStampedModel):

    class Gender(models.TextChoices):
        FEMALE = "FEMALE", _("Female")
        MALE = "MALE", _("Male")
        CUSTOM = "CUSTOM", _("Custom")
        NONE = "NONE", _("Prefer not to say")

    class DocumentType(models.TextChoices):
        NATIONAL_ID = "01", _("National ID Card")
        FOREIGNER_ID = "04", _("Foreigner ID Card")
        TAX_REGISTRY = "06", _("Single Tax Registry")
        PASSPORT = "07", _("Passport")

    username = None
    email = models.EmailField(
        _("email address"),
        unique=True,
    )
    gender = models.CharField(
        max_length=20, choices=Gender.choices, default=Gender.NONE
    )
    custom_gender = models.CharField(max_length=255, blank=True, null=True)
    phone = PhoneNumberField()
    birth_date = models.DateTimeField(validators=[validate_age_minimum])
    document_type = models.CharField(
        max_length=2, choices=DocumentType.choices, default=DocumentType.NATIONAL_ID
    )
    document_value = models.CharField(max_length=20, unique=True)

    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()  # type: ignore

    def clean(self):
        super().clean()
        doc_type_lengths = {
            "01": 8,
            "04": 12,
            "06": 11,
            "07": 12,
        }
        required_length = doc_type_lengths.get(self.document_type)
        if (
            required_length
            and self.document_value
            and len(self.document_value) != required_length
        ):
            raise ValidationError(
                {
                    "document_value": f"Document value for type '{self.get_document_type_display()}' must be exactly {required_length} digits/characters."  # type: ignore
                }
            )

    class Meta:
        app_label = "authenticationApp"
