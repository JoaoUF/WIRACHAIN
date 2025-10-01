from django_extensions.db.models import (
    ActivatorModel,
    TimeStampedModel,
)
from django.db import models
from django.utils.translation import gettext_lazy as _
from utils import Model


class MedicalTest(Model, ActivatorModel, TimeStampedModel):
    name = models.CharField(
        _("name"),
        max_length=255,
    )
    description = models.TextField(
        _("description"),
        blank=True,
        null=True,
    )

    class Meta:
        db_table = "MEDICAL_TEST"
        verbose_name = _("Medical Test")
        verbose_name_plural = _("Medical Tests")
