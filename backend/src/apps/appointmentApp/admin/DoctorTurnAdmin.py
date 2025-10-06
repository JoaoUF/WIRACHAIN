from django.contrib import admin
from ..models import DoctorTurn


@admin.register(DoctorTurn)
class DoctorTurnAdmin(admin.ModelAdmin):
    list_display = ("doctor_schedule", "start_time", "end_time")
    list_filter = ("doctor_schedule",)
    ordering = ("doctor_schedule", "start_time")
