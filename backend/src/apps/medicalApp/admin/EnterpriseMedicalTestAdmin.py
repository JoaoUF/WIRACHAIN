from django.contrib import admin
from ..models import EnterpriseMedicalTest


@admin.register(EnterpriseMedicalTest)
class EnterpriseMedicalTestAdmin(admin.ModelAdmin):
    list_display = [
        "enterprise_user",
        "medical_test",
        "created",
        "modified",
    ]
    list_filter = [
        "enterprise_user",
        "medical_test",
        "created",
        "modified",
    ]
    search_fields = [
        "enterprise_user__email",
        "enterprise_user__first_name",
        "enterprise_user__last_name",
        "medical_test__name",
    ]
    ordering = ["-created"]
    readonly_fields = [
        "created",
        "modified",
    ]
    autocomplete_fields = ["enterprise_user", "medical_test"]

    fieldsets = (
        (None, {"fields": ("enterprise_user", "medical_test")}),
        ("Timestamps", {"fields": ("created", "modified")}),
    )
