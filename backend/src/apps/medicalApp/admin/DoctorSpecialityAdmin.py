from django.contrib import admin
from ..models import DoctorSpeciality


@admin.register(DoctorSpeciality)
class DoctorSpecialityAdmin(admin.ModelAdmin):
    list_display = [
        "doctor_user",
        "speciality",
    ]
    list_filter = [
        "speciality",
        "doctor_user",
    ]
    search_fields = [
        "doctor_user__email",
        "doctor_user__first_name",
        "doctor_user__last_name",
        "speciality__name",
    ]
    autocomplete_fields = ["doctor_user", "speciality"]

    fieldsets = ((None, {"fields": ("doctor_user", "speciality")}),)
