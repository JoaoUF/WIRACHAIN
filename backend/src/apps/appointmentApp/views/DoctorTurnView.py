from rest_framework import viewsets, permissions
from ..models import DoctorTurn
from ..serializers import DoctorTurnSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Doctor Turn"]),
    retrieve=extend_schema(tags=["Doctor Turn"]),
    create=extend_schema(tags=["Doctor Turn"]),
    update=extend_schema(tags=["Doctor Turn"]),
    partial_update=extend_schema(tags=["Doctor Turn"]),
    destroy=extend_schema(tags=["Doctor Turn"]),
)
class DoctorTurnView(viewsets.ModelViewSet):
    queryset = DoctorTurn.objects.all()
    serializer_class = DoctorTurnSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["doctor_schedule"]
    ordering_fields = ["doctor_schedule", "start_time", "end_time"]
    ordering = ["doctor_schedule", "start_time"]
