from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from ..models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    list_display = [
        "email",
        "first_name",
        "last_name",
        "gender",
        "birth_date",
        "phone",
        "document_type",
        "document_value",
        "is_verified",
        "is_active",
        "is_staff",
        "status",
        "activate_date",
        "deactivate_date",
        "created",
        "modified",
    ]
    list_filter = [
        "gender",
        "document_type",
        "is_verified",
        "is_active",
        "is_staff",
        "status",
        "activate_date",
        "deactivate_date",
        "created",
        "modified",
    ]
    ordering = ["-created"]
    search_fields = ["email", "first_name", "last_name", "phone", "document_value"]
    readonly_fields = [
        "created",
        "modified",
        "activate_date",
        "deactivate_date",
        "last_login",
    ]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal info",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "gender",
                    "custom_gender",
                    "birth_date",
                    "phone",
                    "document_type",
                    "document_value",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                    "is_verified",
                )
            },
        ),
        ("Status", {"fields": ("status", "activate_date", "deactivate_date")}),
        ("Important dates", {"fields": ("last_login", "created", "modified")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name",
                    "gender",
                    "custom_gender",
                    "birth_date",
                    "phone",
                    "document_type",
                    "document_value",
                    "is_verified",
                    "is_active",
                    "is_staff",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
    )

    def get_fieldsets(self, request, obj=None):
        if not obj:
            return self.add_fieldsets
        return super().get_fieldsets(request, obj)

    def get_readonly_fields(self, request, obj=None):
        ro = list(self.readonly_fields)
        if not obj:
            ro.remove("last_login")
        return ro

    def get_username_field(self):
        return "email"
