from django.db import models
from django_extensions.db.models import TimeStampedModel
from django.utils.translation import gettext_lazy as _
from .MedicalSpeciality import MedicalSpeciality
from utils import Model


class DoctorMedicalSpeciality(Model, TimeStampedModel):
    doctor_user = models.ForeignKey(
        "authenticationApp.CustomUser",
        on_delete=models.CASCADE,
        related_name="doctor_medical_speciality",
    )
    medical_speciality = models.ForeignKey(
        MedicalSpeciality,
        on_delete=models.CASCADE,
        related_name="doctor_medical_speciality",
    )

    class Meta:
        db_table = "DOCTOR_MEDICAL_SPECIALITY"
        unique_together = ("doctor_user", "medical_speciality")
        verbose_name = _("Doctor Medical Speciality")
        verbose_name_plural = _("Doctors Medicals Specialities")
