from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from ..models import Appointment
from ..serializers import AppointmentSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Appointment"]),
    retrieve=extend_schema(tags=["Appointment"]),
    create=extend_schema(tags=["Appointment"]),
    update=extend_schema(tags=["Appointment"]),
    partial_update=extend_schema(tags=["Appointment"]),
    destroy=extend_schema(tags=["Appointment"]),
)
class AppointmentView(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = [
        "patient",
        "doctor",
        "clinic",
        "speciality",
        "date",
        "status",
    ]
    ordering_fields = [
        "date",
        "start_time",
        "end_time",
        "status",
        "clinic",
        "doctor",
        "patient",
    ]
    ordering = ["-date", "start_time"]
