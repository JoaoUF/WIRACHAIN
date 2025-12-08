from django_extensions.db.models import ActivatorModel
from django.db import models
from django.utils.translation import gettext_lazy as _
from .Test import Test
from .Clinic import Clinic
from utils import Model


class ClinicTest(Model, ActivatorModel):
    clinic = models.ForeignKey(
        Clinic,
        on_delete=models.CASCADE,
        related_name="clinic_test",
    )
    test = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name="clinic_test",
    )

    class Meta:
        db_table = "MED_CLINIC_TEST"
        unique_together = ("clinic", "test")
        verbose_name = _("Clinic Test")
        verbose_name_plural = _("Clinics Tests")
