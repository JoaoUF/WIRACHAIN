from django.contrib import admin
from ..models import Disease


@admin.register(Disease)
class DiseaseAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "description",
        "enterprise_user",
        "status",
        "activate_date",
        "deactivate_date",
        "created",
        "modified",
    ]
    list_filter = [
        "enterprise_user",
        "status",
        "activate_date",
        "deactivate_date",
        "created",
        "modified",
    ]
    search_fields = [
        "enterprise_user__email",
        "enterprise_user__first_name",
        "enterprise_user__last_name",
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
