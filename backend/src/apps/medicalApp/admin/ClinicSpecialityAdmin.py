from django.contrib import admin
from ..models import ClinicSpeciality


@admin.register(ClinicSpeciality)
class ClinicSpecialityAdmin(admin.ModelAdmin):
    list_display = [
        "clinic",
        "speciality",
    ]
    list_filter = [
        "clinic",
        "speciality",
    ]
    search_fields = [
        "clinic__name",
        "clinic__email",
        "clinic__enterprise_user",
        "speciality__name",
    ]
    autocomplete_fields = ["clinic", "speciality"]

    fieldsets = ((None, {"fields": ("clinic", "speciality")}),)
