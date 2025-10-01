from django_extensions.db.models import TimeStampedModel
from django.db import models
from django.utils.translation import gettext_lazy as _
from ....utils import Model
from .MedicalSpeciality import MedicalSpeciality


class ClinicMedicalSpeciality(Model, TimeStampedModel):
    clinic = models.ForeignKey(
        "authenticationApp.CustomUser",
        on_delete=models.CASCADE,
        related_name="clinic_medical_specialities",
    )
    medical_speciality = models.ForeignKey(
        MedicalSpeciality,
        on_delete=models.CASCADE,
        related_name="clinic_medical_specialities",
    )

    class Meta:
        db_table = "CLINIC_MEDICAL_SPECIALITY"
        unique_together = ("clinic", "medical_speciality")
        verbose_name = _("Clinic Medical Speciality")
        verbose_name_plural = _("Clinic Medical Specialities")
