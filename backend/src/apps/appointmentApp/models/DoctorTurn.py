from django.db import models
from django.utils.translation import gettext_lazy as _
from utils import Model
from .DoctorSchedule import DoctorSchedule


class DoctorTurn(Model):
    doctor_schedule = models.ForeignKey(DoctorSchedule, related_name="turns", on_delete=models.CASCADE)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        db_table = "MED_DOCTOR_TURN"
        ordering = ["doctor_schedule", "start_time"]
        verbose_name = _("Doctor Turn")
        verbose_name_plural = _("Doctor Turns")

    def __str__(self):
        return f"{self.doctor_schedule}: {self.start_time} - {self.end_time}"
