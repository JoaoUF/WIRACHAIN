from rest_framework.permissions import BasePermission


class IsInGroup(BasePermission):
    group_name = None

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name=self.group_name).exists()


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
