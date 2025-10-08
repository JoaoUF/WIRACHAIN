from django.db import models
from django.utils.translation import gettext_lazy as _
from authenticationApp.models import CustomUser
from medicalApp.models import Clinic, Speciality


class AppointmentStatus(models.TextChoices):
    SCHEDULED = "scheduled", _("Scheduled")
    CONFIRMED = "confirmed", _("Confirmed")
    CANCELLED = "cancelled", _("Cancelled")
    COMPLETED = "completed", _("Completed")
    NO_SHOW = "no_show", _("No-show")


class Appointment(models.Model):
    patient = models.ForeignKey(CustomUser, related_name="appointments_as_patient", on_delete=models.CASCADE)
    doctor = models.ForeignKey(CustomUser, related_name="appointments_as_doctor", on_delete=models.CASCADE)
    clinic = models.ForeignKey(Clinic, related_name="appointments", on_delete=models.CASCADE)
    speciality = models.ForeignKey(
        Speciality,
        related_name="appointments",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(
        max_length=16,
        choices=AppointmentStatus.choices,
        default=AppointmentStatus.SCHEDULED,
    )
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "MED_APPOINTMENT"
        ordering = ["-date", "start_time"]
        verbose_name = _("Appointment")
        verbose_name_plural = _("Appointments")

    def __str__(self):
        return (
            f"{self.patient} with {self.doctor} at {self.clinic} " f"on {self.date} {self.start_time}-{self.end_time}"
        )
