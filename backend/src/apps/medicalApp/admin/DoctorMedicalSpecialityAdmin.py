from django.contrib import admin
from ..models import DoctorMedicalSpeciality


@admin.register(DoctorMedicalSpeciality)
class DoctorMedicalSpecialityAdmin(admin.ModelAdmin):
    list_display = [
        "doctor_user",
        "medical_speciality",
        "created",
        "modified",
    ]
    list_filter = [
        "medical_speciality",
        "doctor_user",
        "created",
        "modified",
    ]
    search_fields = [
        "doctor_user__email",
        "doctor_user__first_name",
        "doctor_user__last_name",
        "medical_speciality__name",
    ]
    ordering = ["-created"]
    readonly_fields = [
        "created",
        "modified",
    ]
    autocomplete_fields = ["doctor_user", "medical_speciality"]

    fieldsets = (
        (None, {"fields": ("doctor_user", "medical_speciality")}),
        ("Timestamps", {"fields": ("created", "modified")}),
    )
