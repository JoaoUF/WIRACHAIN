from rest_framework import viewsets, permissions
from ..models import ClinicSchedule
from ..serializers import ClinicScheduleSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Clinic Schedule"]),
    retrieve=extend_schema(tags=["Clinic Schedule"]),
    create=extend_schema(tags=["Clinic Schedule"]),
    update=extend_schema(tags=["Clinic Schedule"]),
    partial_update=extend_schema(tags=["Clinic Schedule"]),
    destroy=extend_schema(tags=["Clinic Schedule"]),
)
class ClinicScheduleView(viewsets.ModelViewSet):
    queryset = ClinicSchedule.objects.all()
    serializer_class = ClinicScheduleSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["clinic", "day_of_week"]
    ordering_fields = ["clinic", "day_of_week", "open_time", "close_time"]
