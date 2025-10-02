from django.contrib import admin
from ..models import ClinicTest


@admin.register(ClinicTest)
class ClinicTestAdmin(admin.ModelAdmin):
    list_display = [
        "clinic",
        "test",
        "created",
        "modified",
    ]
    list_filter = [
        "clinic",
        "test",
        "created",
        "modified",
    ]
    search_fields = [
        "clinic__name",
        "clinic__email",
        "test__name",
    ]
    ordering = ["-created"]
    readonly_fields = [
        "created",
        "modified",
    ]
    autocomplete_fields = ["clinic", "test"]

    fieldsets = (
        (None, {"fields": ("clinic", "test")}),
        ("Timestamps", {"fields": ("created", "modified")}),
    )
