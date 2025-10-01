from rest_framework import viewsets, permissions
from ..models import MedicalSpeciality
from ..serializers import MedicalSpecialitySerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Medical Speciality"]),
    retrieve=extend_schema(tags=["Medical Speciality"]),
    create=extend_schema(tags=["Medical Speciality"]),
    update=extend_schema(tags=["Medical Speciality"]),
    partial_update=extend_schema(tags=["Medical Speciality"]),
    destroy=extend_schema(tags=["Medical Speciality"]),
)
class MedicalSpecialityView(viewsets.ModelViewSet):
    queryset = MedicalSpeciality.objects.all()
    serializer_class = MedicalSpecialitySerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["name", "status", "activate_date", "deactivate_date"]
