from django.db import models
from django_extensions.db.models import TimeStampedModel
from django.utils.translation import gettext_lazy as _
from .Speciality import Speciality
from utils import Model


class DoctorSpeciality(Model, TimeStampedModel):
    doctor_user = models.ForeignKey(
        "authenticationApp.CustomUser",
        on_delete=models.CASCADE,
        related_name="doctor_speciality",
    )
    speciality = models.ForeignKey(
        Speciality,
        on_delete=models.CASCADE,
        related_name="doctor_speciality",
    )

    class Meta:
        db_table = "MED_DOCTOR_SPECIALITY"
        unique_together = ("doctor_user", "speciality")
        verbose_name = _("Doctor Speciality")
        verbose_name_plural = _("Doctors Specialities")
