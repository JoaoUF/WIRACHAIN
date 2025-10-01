from django_extensions.db.models import TimeStampedModel
from django.db import models
from django.utils.translation import gettext_lazy as _
from ....utils import Model
from .MedicalTest import MedicalTest


class ClinicMedicalTest(Model, TimeStampedModel):
    clinic = models.ForeignKey(
        "authenticationApp.CustomUser",
        on_delete=models.CASCADE,
        related_name="clinic_medical_tests",
    )
    medical_test = models.ForeignKey(
        MedicalTest,
        on_delete=models.CASCADE,
        related_name="clinic_medical_tests",
    )

    class Meta:
        db_table = "CLINIC_MEDICAL_TEST"
        unique_together = ("clinic", "medical_test")
        verbose_name = _("Clinic Medical Test")
        verbose_name_plural = _("Clinic Medical Tests")
