from django.contrib import admin
from guardian.admin import GuardedModelAdmin
from ..models import Test


@admin.register(Test)
class TestAdmin(GuardedModelAdmin):
    list_display = [
        "id",
        "name",
        "description",
        "enterprise_user",
        "status",
        "activate_date",
        "deactivate_date",
    ]
    list_filter = [
        "enterprise_user",
        "status",
        "activate_date",
        "deactivate_date",
    ]
    search_fields = [
        "enterprise_user__email",
        "enterprise_user__first_name",
        "enterprise_user__last_name",
        "name",
        "description",
    ]
    readonly_fields = [
        "activate_date",
        "deactivate_date",
    ]

    fieldsets = (
        (None, {"fields": ("name", "description")}),
        ("Activation", {"fields": ("status", "activate_date", "deactivate_date")}),
    )
