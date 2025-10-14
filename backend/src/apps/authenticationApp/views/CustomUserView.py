from rest_framework import viewsets, mixins
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema_view, extend_schema
from ..models import CustomUser
from ..serializers import CustomUserSerializer
from ..filters import CustomUserFilter


@extend_schema_view(
    list=extend_schema(tags=["Users"]),
    retrieve=extend_schema(tags=["Users"]),
    create=extend_schema(tags=["Users"]),
    update=extend_schema(tags=["Users"]),
    partial_update=extend_schema(tags=["Users"]),
    destroy=extend_schema(tags=["Users"]),
)
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_class = CustomUserFilter


@extend_schema_view(
    list=extend_schema(tags=["Users"]),
)
class AdminUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(groups__name="ADMIN")
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filterset_class = CustomUserFilter


@extend_schema_view(
    list=extend_schema(tags=["Users"]),
)
class ClinicUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(
        groups__name__in=[
            "ENTERPRISE_BASIC",
            "ENTERPRISE_PREMIUM",
            "ENTERPRISE_PROFESSISONAL",
        ]
    ).distinct()
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsClinic]
    filterset_class = CustomUserFilter


@extend_schema_view(
    list=extend_schema(tags=["Users"]),
)
class DoctorUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(groups__name="DOCTOR")
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsDoctor]
    filterset_class = CustomUserFilter


@extend_schema_view(
    list=extend_schema(tags=["Users"]),
)
class PatientUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(groups__name="PATIENT")
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsPatient]
    filterset_class = CustomUserFilter
