from rest_framework import viewsets, permissions
from ..models import ClinicDoctor
from ..serializers import ClinicDoctorSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Clinic Doctor"]),
    retrieve=extend_schema(tags=["Clinic Doctor"]),
    create=extend_schema(tags=["Clinic Doctor"]),
    update=extend_schema(tags=["Clinic Doctor"]),
    partial_update=extend_schema(tags=["Clinic Doctor"]),
    destroy=extend_schema(tags=["Clinic Doctor"]),
)
class ClinicDoctorView(viewsets.ModelViewSet):
    queryset = ClinicDoctor.objects.all()
    serializer_class = ClinicDoctorSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["doctor_user", "clinic"]
