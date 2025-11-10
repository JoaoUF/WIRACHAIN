from rest_framework.permissions import BasePermission


class IsInGroup(BasePermission):
    group_name = None

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Useful debug: print actual group names (not the manager object)
        print("USER GROUPS:", list(request.user.groups.values_list("name", flat=True)))
        return request.user.groups.filter(name=self.group_name).exists()


class IsAdmin(IsInGroup):
    group_name = "ADMIN"


class IsEnterpriseBasic(IsInGroup):
    group_name = "ENTERPRISE_BASIC"


class IsEnterprisePremium(IsInGroup):
    group_name = "ENTERPRISE_PREMIUM"


class IsEnterpriseProfessional(IsInGroup):
    group_name = "ENTERPRISE_PROFESSIONAL"


class IsDoctor(IsInGroup):
    group_name = "DOCTOR"


class IsPatient(IsInGroup):
    group_name = "PATIENT"


class IsInAnyGroups(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        allowed = getattr(view, "allowed_groups", None)
        if not allowed:
            return False
        return request.user.groups.filter(name__in=allowed).exists()


class IsAdminOrEnterprise(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        allowed = {"ADMIN", "ENTERPRISE_BASIC", "ENTERPRISE_PREMIUM", "ENTERPRISE_PROFESSIONAL"}
        return request.user.groups.filter(name__in=allowed).exists()
