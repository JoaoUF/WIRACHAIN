from django.contrib import admin
from ..models import ClinicDoctor


@admin.register(ClinicDoctor)
class ClinicDoctorAdmin(admin.ModelAdmin):
    list_display = [
        "doctor_user",
        "clinic",
    ]
    list_filter = [
        "clinic",
        "doctor_user",
    ]
    search_fields = [
        "doctor_user__email",
        "doctor_user__first_name",
        "doctor_user__last_name",
        "clinic__name",
        "clinic__email",
    ]
    autocomplete_fields = ["doctor_user", "clinic"]

    fieldsets = ((None, {"fields": ("doctor_user", "clinic")}),)
