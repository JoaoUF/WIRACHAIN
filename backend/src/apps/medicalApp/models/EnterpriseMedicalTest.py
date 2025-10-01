from django_extensions.db.models import TimeStampedModel
from django.db import models
from django.utils.translation import gettext_lazy as _
from .MedicalTest import MedicalTest
from utils import Model


class EnterpriseMedicalTest(Model, TimeStampedModel):
    enterprise_user = models.ForeignKey(
        "authenticationApp.CustomUser",
        on_delete=models.CASCADE,
        related_name="enterprise_medical_tests",
    )
    medical_test = models.ForeignKey(
        MedicalTest,
        on_delete=models.CASCADE,
        related_name="enterprise_medical_tests",
    )

    class Meta:
        db_table = "ENTERPRISE_MEDICAL_TEST"
        unique_together = ("enterprise_user", "medical_test")
        verbose_name = _("Enteprise Medical Test")
        verbose_name_plural = _("Enteprise Medical Tests")
