from rest_framework import viewsets, permissions
from ..models import EnterpriseMedicalSpeciality
from ..serializers import EnterpriseMedicalSpecialitySerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Enterprise Medical Speciality"]),
    retrieve=extend_schema(tags=["Enterprise Medical Speciality"]),
    create=extend_schema(tags=["Enterprise Medical Speciality"]),
    update=extend_schema(tags=["Enterprise Medical Speciality"]),
    partial_update=extend_schema(tags=["Enterprise Medical Speciality"]),
    destroy=extend_schema(tags=["Enterprise Medical Speciality"]),
)
class EnterpriseMedicalSpecialityView(viewsets.ModelViewSet):
    queryset = EnterpriseMedicalSpeciality.objects.all()
    serializer_class = EnterpriseMedicalSpecialitySerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["enterprise_user", "medical_speciality"]
