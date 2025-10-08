from django_extensions.db.models import ActivatorModel, TimeStampedModel
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from phonenumber_field.modelfields import PhoneNumberField

from .CustomUserManager import CustomUserManager
from ..validators import validate_age_minimum


class CustomUser(AbstractUser, PermissionsMixin, ActivatorModel):

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
    gender = models.CharField(max_length=20, choices=Gender.choices, default=Gender.NONE)
    custom_gender = models.CharField(max_length=255, blank=True, null=True)
    phone = PhoneNumberField()
    birth_date = models.DateTimeField(validators=[validate_age_minimum])
    document_type = models.CharField(max_length=2, choices=DocumentType.choices, default=DocumentType.NATIONAL_ID)
    document_value = models.CharField(max_length=20, unique=True)

    enterprise = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="doctors_created",
        limit_choices_to={
            "groups__name__in": [
                "ENTERPRISE_BASIC",
                "ENTERPRISE_PREMIUM",
                "ENTERPRISE_PROFESSISONAL",
            ]
        },
        help_text="The enterprise (user) that created this doctor account.",
    )

    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()  # type: ignore

    def clean(self):
        super().clean()
        self._validate_enterprise_doctor_relationship()
        self._validate_document_value_length()

    def _validate_enterprise_doctor_relationship(self):
        if self.groups.filter(name="DOCTOR").exists() and not self.enterprise:
            raise ValidationError("A doctor must be associated with an enterprise.")
        if not self.groups.filter(name="DOCTOR").exists() and self.enterprise:
            raise ValidationError("Only doctors can be linked to an enterprise.")

    def _validate_document_value_length(self):
        doc_type_lengths = {
            "01": 8,
            "04": 12,
            "06": 11,
            "07": 12,
        }
        required_length = doc_type_lengths.get(self.document_type)
        if required_length and self.document_value and len(self.document_value) != required_length:
            raise ValidationError(
                {
                    "document_value": f"Document value for type '{self.get_document_type_display()}' must be exactly {required_length} digits/characters."  # type: ignore
                }
            )

    class Meta:
        app_label = "authenticationApp"
