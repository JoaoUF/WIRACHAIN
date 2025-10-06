from django.contrib import admin
from ..models import ClinicTest


@admin.register(ClinicTest)
class ClinicTestAdmin(admin.ModelAdmin):
    list_display = [
        "clinic",
        "test",
    ]
    list_filter = [
        "clinic",
        "test",
    ]
    search_fields = [
        "clinic__name",
        "clinic__email",
        "test__name",
    ]
    autocomplete_fields = ["clinic", "test"]

    fieldsets = ((None, {"fields": ("clinic", "test")}),)
