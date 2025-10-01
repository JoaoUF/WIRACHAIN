from django_extensions.db.models import TimeStampedModel
from django.db import models
from django.utils.translation import gettext_lazy as _
from .MedicalSpeciality import MedicalSpeciality
from utils import Model


class EnterpriseMedicalSpeciality(Model, TimeStampedModel):
    enterprise_user = models.ForeignKey(
        "authenticationApp.CustomUser",
        on_delete=models.CASCADE,
        related_name="enterprise_medical_specialities",
    )
    medical_speciality = models.ForeignKey(
        MedicalSpeciality,
        on_delete=models.CASCADE,
        related_name="enterprise_medical_specialities",
    )

    class Meta:
        db_table = "ENTERPRISE_MEDICAL_SPECIALITY"
        unique_together = ("enterprise_user", "medical_speciality")
        verbose_name = _("Enterprise Medical Speciality")
        verbose_name_plural = _("Enterprise Medical Specialities")
