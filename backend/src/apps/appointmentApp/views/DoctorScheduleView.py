from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from ..models import DoctorSchedule
from ..serializers import DoctorScheduleSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Doctor Schedule"]),
    retrieve=extend_schema(tags=["Doctor Schedule"]),
    create=extend_schema(tags=["Doctor Schedule"]),
    update=extend_schema(tags=["Doctor Schedule"]),
    partial_update=extend_schema(tags=["Doctor Schedule"]),
    destroy=extend_schema(tags=["Doctor Schedule"]),
)
class DoctorScheduleView(viewsets.ModelViewSet):
    queryset = DoctorSchedule.objects.all()
    serializer_class = DoctorScheduleSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["doctor", "day_of_week"]
    ordering_fields = ["doctor", "day_of_week"]
    ordering = ["doctor", "day_of_week"]
