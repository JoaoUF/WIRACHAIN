from django.contrib import admin
from ..models import ClinicSpeciality


@admin.register(ClinicSpeciality)
class ClinicSpecialityAdmin(admin.ModelAdmin):
    list_display = [
        "clinic",
        "speciality",
        "created",
        "modified",
    ]
    list_filter = [
        "clinic",
        "speciality",
        "created",
        "modified",
    ]
    search_fields = [
        "clinic__name",
        "clinic__email",
        "clinic__enterprise_user",
        "speciality__name",
    ]
    ordering = ["-created"]
    readonly_fields = [
        "created",
        "modified",
    ]
    autocomplete_fields = ["clinic", "speciality"]

    fieldsets = (
        (None, {"fields": ("clinic", "speciality")}),
        ("Timestamps", {"fields": ("created", "modified")}),
    )
