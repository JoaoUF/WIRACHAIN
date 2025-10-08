from django.db import models
from django.utils.translation import gettext_lazy as _
from .Clinic import Clinic
from utils import Model


class ClinicSchedule(Model):
    class WeekDay(models.IntegerChoices):
        MONDAY = 1, _("Monday")
        TUESDAY = 2, _("Tuesday")
        WEDNESDAY = 3, _("Wednesday")
        THURSDAY = 4, _("Thursday")
        FRIDAY = 5, _("Friday")
        SATURDAY = 6, _("Saturday")
        SUNDAY = 7, _("Sunday")

    clinic = models.ForeignKey(Clinic, related_name="schedules", on_delete=models.CASCADE)
    day_of_week = models.PositiveSmallIntegerField(choices=WeekDay.choices)
    open_time = models.TimeField()
    close_time = models.TimeField()

    class Meta:
        db_table = "MED_CLINIC_SCHEDULE"
        unique_together = ("clinic", "day_of_week")
        ordering = ["clinic", "day_of_week"]
        verbose_name = _("Clinic Schedule")
        verbose_name_plural = _("Clinic Schedules")

    def __str__(self):
        return f"{self.clinic.name} - {self.get_day_of_week_display()}: {self.open_time} - {self.close_time}"  # type: ignore
