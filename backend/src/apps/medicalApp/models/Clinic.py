from ....utils import Model
from django_extensions.db.models import (
    ActivatorModel,
    TimeStampedModel,
)
from django.db import models
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from cities_light.models import Country, Region, City


class Clinic(Model, ActivatorModel, TimeStampedModel):
    title = models.CharField(
        _("title"),
        max_length=255,
    )
    description = models.TextField(
        _("description"),
        blank=True,
        null=True,
    )
    email = models.EmailField(
        _("email address"),
        unique=True,
    )
    website_url = models.URLField(
        max_length=200,
        blank=True,
        null=True,
    )
    phone = PhoneNumberField()

    address = models.CharField(
        _("Street Address"),
        max_length=255,
    )
    city = models.ForeignKey(
        City,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    region = models.ForeignKey(
        Region,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    country = models.ForeignKey(
        Country,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "CLINIC"
        verbose_name = _("Clinic")
        verbose_name_plural = _("Clinics")
