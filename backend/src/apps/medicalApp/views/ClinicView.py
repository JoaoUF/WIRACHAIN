from rest_framework import viewsets, permissions
from ..models import Clinic
from ..serializers import ClinicSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Clinic"]),
    retrieve=extend_schema(tags=["Clinic"]),
    create=extend_schema(tags=["Clinic"]),
    update=extend_schema(tags=["Clinic"]),
    partial_update=extend_schema(tags=["Clinic"]),
    destroy=extend_schema(tags=["Clinic"]),
)
class ClinicView(viewsets.ModelViewSet):
    queryset = Clinic.objects.all()
    serializer_class = ClinicSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["city", "country", "enterprise_user"]
