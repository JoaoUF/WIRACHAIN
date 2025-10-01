from django.db import models
from django_extensions.db.models import TimeStampedModel
from django.utils.translation import gettext_lazy as _
from utils import Model
from .Clinic import Clinic


class ClinicDoctor(Model, TimeStampedModel):
    doctor_user = models.ForeignKey(
        "authenticationApp.CustomUser",
        on_delete=models.CASCADE,
        related_name="enterprise_doctor",
    )
    clinic = models.ForeignKey(
        Clinic,
        on_delete=models.CASCADE,
        related_name="enterprise_doctor",
    )

    class Meta:
        db_table = "CLINIC_DOCTOR"
        unique_together = ("doctor_user", "clinic")
        verbose_name = _("Clinic Doctor")
        verbose_name_plural = _("Clinics Doctors")
