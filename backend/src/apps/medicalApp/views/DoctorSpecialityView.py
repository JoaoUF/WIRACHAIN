from rest_framework import viewsets, permissions
from ..models import DoctorSpeciality
from ..serializers import DoctorSpecialitySerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Doctor Speciality"]),
    retrieve=extend_schema(tags=["Doctor Speciality"]),
    create=extend_schema(tags=["Doctor Speciality"]),
    update=extend_schema(tags=["Doctor Speciality"]),
    partial_update=extend_schema(tags=["Doctor Speciality"]),
    destroy=extend_schema(tags=["Doctor Speciality"]),
)
class DoctorSpecialityView(viewsets.ModelViewSet):
    queryset = DoctorSpeciality.objects.all()
    serializer_class = DoctorSpecialitySerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["doctor_user", "speciality"]
