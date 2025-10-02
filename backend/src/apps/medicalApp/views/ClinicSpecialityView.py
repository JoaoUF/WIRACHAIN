from rest_framework import viewsets, permissions
from ..models import ClinicSpeciality
from ..serializers import ClinicSpecialitySerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Clinic Speciality"]),
    retrieve=extend_schema(tags=["Clinic Speciality"]),
    create=extend_schema(tags=["Clinic Speciality"]),
    update=extend_schema(tags=["Clinic Speciality"]),
    partial_update=extend_schema(tags=["Clinic Speciality"]),
    destroy=extend_schema(tags=["Clinic Speciality"]),
)
class ClinicSpecialityView(viewsets.ModelViewSet):
    queryset = ClinicSpeciality.objects.all()
    serializer_class = ClinicSpecialitySerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["clinic", "speciality"]
