from rest_framework import viewsets, permissions
from ..models import DoctorMedicalSpeciality
from ..serializers import DoctorMedicalSpecialitySerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Doctor Medical Speciality"]),
    retrieve=extend_schema(tags=["Doctor Medical Speciality"]),
    create=extend_schema(tags=["Doctor Medical Speciality"]),
    update=extend_schema(tags=["Doctor Medical Speciality"]),
    partial_update=extend_schema(tags=["Doctor Medical Speciality"]),
    destroy=extend_schema(tags=["Doctor Medical Speciality"]),
)
class DoctorMedicalSpecialityView(viewsets.ModelViewSet):
    queryset = DoctorMedicalSpeciality.objects.all()
    serializer_class = DoctorMedicalSpecialitySerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["doctor_user", "medical_speciality"]
