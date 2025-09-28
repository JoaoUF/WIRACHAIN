from rest_framework import viewsets, permissions, mixins
from django_filters.rest_framework import DjangoFilterBackend
from ..models import CustomUser
from ..serializers import CustomUserSerializer
from ..permissions import IsAdmin, IsClinic, IsDoctor, IsPatient
from ..filters import CustomUserFilter


class CustomUserViewSet(viewsets.ModelViewSet):
    """
    Full CRUD API for CustomUser:
      - POST /users/     : Create
      - GET /users/      : List
      - GET /users/{id}/ : Retrieve
      - PUT /users/{id}/ : Update all fields
      - PATCH /users/{id}/ : Partial update
      - DELETE /users/{id}/ : Delete
    Supports django-filter for query filtering.
    """

    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = CustomUserFilter


class AdminUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(groups__name="admin")
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_class = CustomUserFilter


class ClinicUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(groups__name="clinic")
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsClinic]
    filter_backends = [DjangoFilterBackend]
    filterset_class = CustomUserFilter


class DoctorUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(groups__name="doctor")
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsDoctor]
    filter_backends = [DjangoFilterBackend]
    filterset_class = CustomUserFilter


class PatientUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(groups__name="patient")
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsPatient]
    filter_backends = [DjangoFilterBackend]
    filterset_class = CustomUserFilter
