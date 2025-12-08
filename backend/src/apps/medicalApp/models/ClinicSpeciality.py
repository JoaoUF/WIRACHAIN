from django_extensions.db.models import ActivatorModel
from django.db import models
from django.utils.translation import gettext_lazy as _
from .Speciality import Speciality
from .Clinic import Clinic
from utils import Model


class ClinicSpeciality(Model, ActivatorModel):
    clinic = models.ForeignKey(
        Clinic,
        on_delete=models.CASCADE,
        related_name="clinic_speciality",
    )
    speciality = models.ForeignKey(
        Speciality,
        on_delete=models.CASCADE,
        related_name="clinic_speciality",
    )

    class Meta:
        db_table = "MED_CLINIC_SPECIALITY"
        unique_together = ("clinic", "speciality")
        verbose_name = _("Clinic Speciality")
        verbose_name_plural = _("Clinic Specialities")
