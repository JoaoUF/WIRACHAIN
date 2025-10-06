from django.contrib import admin
from ..models import Speciality


@admin.register(Speciality)
class SpecialityAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "enterprise_user",
        "status",
        "activate_date",
        "deactivate_date",
    )
    list_filter = (
        "status",
        "activate_date",
        "deactivate_date",
        "enterprise_user",
    )
    search_fields = ("name", "description", "enterprise_user__email")
    fieldsets = (
        (None, {"fields": ("name", "description", "enterprise_user")}),
        ("Status", {"fields": ("status", "activate_date", "deactivate_date")}),
    )
