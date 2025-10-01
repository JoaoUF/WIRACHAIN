from django.contrib import admin
from ..models import MedicalSpeciality


@admin.register(MedicalSpeciality)
class MedicalSpecialityAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "description",
        "status",
        "activate_date",
        "deactivate_date",
        "created",
        "modified",
    ]
    list_filter = [
        "status",
        "activate_date",
        "deactivate_date",
        "created",
        "modified",
    ]
    search_fields = [
        "name",
        "description",
    ]
    ordering = ["-created"]
    readonly_fields = [
        "created",
        "modified",
        "activate_date",
        "deactivate_date",
    ]

    fieldsets = (
        (None, {"fields": ("name", "description")}),
        ("Activation", {"fields": ("status", "activate_date", "deactivate_date")}),
        ("Timestamps", {"fields": ("created", "modified")}),
    )
