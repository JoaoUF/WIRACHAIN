from django.db import models
from django.utils.translation import gettext_lazy as _
from authenticationApp.models import CustomUser
from utils import Model


class DoctorSchedule(Model):
    class WeekDay(models.IntegerChoices):
        MONDAY = 1, _("Monday")
        TUESDAY = 2, _("Tuesday")
        WEDNESDAY = 3, _("Wednesday")
        THURSDAY = 4, _("Thursday")
        FRIDAY = 5, _("Friday")
        SATURDAY = 6, _("Saturday")
        SUNDAY = 7, _("Sunday")

    doctor = models.ForeignKey(
        CustomUser, related_name="doctor_schedules", on_delete=models.CASCADE
    )
    day_of_week = models.PositiveSmallIntegerField(choices=WeekDay.choices)

    class Meta:
        db_table = "MED_DOCTOR_SCHEDULE"
        unique_together = ("doctor", "day_of_week")
        ordering = ["doctor", "day_of_week"]
        verbose_name = _("Doctor Schedule")
        verbose_name_plural = _("Doctor Schedules")

    def __str__(self):
        return f"{self.doctor} - {self.get_day_of_week_display()}"  # type: ignore
