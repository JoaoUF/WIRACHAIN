from django.contrib import admin
from ..models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        "patient",
        "doctor",
        "clinic",
        "speciality",
        "date",
        "start_time",
        "end_time",
        "status",
    )
    list_filter = ("clinic", "doctor", "patient", "speciality", "status", "date")
    search_fields = (
        "patient__username",
        "patient__email",
        "doctor__username",
        "doctor__email",
        "clinic__name",
        "speciality__name",
        "notes",
    )
    ordering = ("-date", "start_time")
