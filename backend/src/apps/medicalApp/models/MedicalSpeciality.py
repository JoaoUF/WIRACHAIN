from django_extensions.db.models import (
    ActivatorModel,
    TimeStampedModel,
)
from django.db import models
from django.utils.translation import gettext_lazy as _
from ....utils import Model


class MedicalSpeciality(Model, ActivatorModel, TimeStampedModel):
    title = models.CharField(
        _("title"),
        max_length=255,
    )
    description = models.TextField(
        _("description"),
        blank=True,
        null=True,
    )

    class Meta:
        db_table = "MEDICAL_SPECIALITY"
        verbose_name = _("Medical Speciality")
        verbose_name_plural = _("Medical Specialities")
