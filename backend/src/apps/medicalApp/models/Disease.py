from django_extensions.db.models import (
    ActivatorModel,
    TimeStampedModel,
)
from django.db import models
from django.utils.translation import gettext_lazy as _
from utils import Model


class Disease(Model, ActivatorModel, TimeStampedModel):
    name = models.CharField(
        _("name"),
        max_length=255,
    )
    description = models.TextField(
        _("description"),
        blank=True,
        null=True,
    )
    enterprise_user = models.ForeignKey(
        "authenticationApp.CustomUser",
        on_delete=models.CASCADE,
        related_name="disease",
    )

    class Meta:
        db_table = "MED_DISEASE"
        verbose_name = _("Disease")
        verbose_name_plural = _("Diseases")
