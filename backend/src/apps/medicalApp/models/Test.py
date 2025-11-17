from django_extensions.db.models import ActivatorModel
from django.db import models
from django.utils.translation import gettext_lazy as _
from utils import Model
from ..validators import alphanumeric


class Test(Model, ActivatorModel):
    name = models.CharField(
        _("name"),
        max_length=255,
        validators=[alphanumeric],
    )
    description = models.TextField(
        _("description"),
        blank=True,
        null=True,
    )
    enterprise_user = models.ForeignKey(
        "authenticationApp.CustomUser",
        on_delete=models.CASCADE,
        related_name="test",
    )

    class Meta:
        db_table = "MED_TEST"
        verbose_name = _("Test")
        verbose_name_plural = _("Tests")
