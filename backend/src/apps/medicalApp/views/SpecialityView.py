from rest_framework import viewsets, permissions
from ..models import Speciality
from ..serializers import SpecialitySerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Speciality"]),
    retrieve=extend_schema(tags=["Speciality"]),
    create=extend_schema(tags=["Speciality"]),
    update=extend_schema(tags=["Speciality"]),
    partial_update=extend_schema(tags=["Speciality"]),
    destroy=extend_schema(tags=["Speciality"]),
)
class SpecialityView(viewsets.ModelViewSet):
    queryset = Speciality.objects.all()
    serializer_class = SpecialitySerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["name", "status", "activate_date", "deactivate_date"]
    search_fields = ["name"]
