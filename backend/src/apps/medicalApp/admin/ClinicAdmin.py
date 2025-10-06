from django.contrib import admin
from ..models import Clinic


@admin.register(Clinic)
class ClinicAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "email",
        "phone",
        "address",
        "city",
        "region",
        "country",
        "enterprise_user",
        "status",
        "activate_date",
        "deactivate_date",
    ]
    list_filter = [
        "city",
        "region",
        "country",
        "status",
        "activate_date",
        "deactivate_date",
    ]
    search_fields = ["name", "email", "phone", "address", "enterprise_user__email"]
    readonly_fields = ["activate_date", "deactivate_date"]
    autocomplete_fields = ["city", "region", "country", "enterprise_user"]

    fieldsets = (
        (None, {"fields": ("name", "email", "website_url", "phone", "address")}),
        ("Location", {"fields": ("city", "region", "country")}),
        ("Enterprise", {"fields": ("enterprise_user",)}),
        ("Status", {"fields": ("status", "activate_date", "deactivate_date")}),
    )
