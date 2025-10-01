from django.contrib import admin
from ..models import EnterpriseMedicalSpeciality


@admin.register(EnterpriseMedicalSpeciality)
class EnterpriseMedicalSpecialityAdmin(admin.ModelAdmin):
    list_display = [
        "enterprise_user",
        "medical_speciality",
        "created",
        "modified",
    ]
    list_filter = [
        "enterprise_user",
        "medical_speciality",
        "created",
        "modified",
    ]
    search_fields = [
        "enterprise_user__email",
        "enterprise_user__first_name",
        "enterprise_user__last_name",
        "medical_speciality__name",
    ]
    ordering = ["-created"]
    readonly_fields = [
        "created",
        "modified",
    ]
    autocomplete_fields = ["enterprise_user", "medical_speciality"]

    fieldsets = (
        (None, {"fields": ("enterprise_user", "medical_speciality")}),
        ("Timestamps", {"fields": ("created", "modified")}),
    )
