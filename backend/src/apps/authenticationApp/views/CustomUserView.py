from rest_framework import viewsets, permissions, mixins
from django_filters.rest_framework import DjangoFilterBackend
from ..models import CustomUser
from ..serializers import CustomUserSerializer
from ..permissions import IsAdmin, IsClinic, IsDoctor, IsPatient
from ..filters import CustomUserFilter


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_class = CustomUserFilter


class AdminUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(groups__name="ADMIN")
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filterset_class = CustomUserFilter


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


class DoctorUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(groups__name="DOCTOR")
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsDoctor]
    filterset_class = CustomUserFilter


class PatientUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(groups__name="PATIENT")
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsPatient]
    filterset_class = CustomUserFilter
