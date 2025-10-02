from rest_framework import viewsets, permissions
from ..models import ClinicTest
from ..serializers import ClinicTestSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Clinic Test"]),
    retrieve=extend_schema(tags=["Clinic Test"]),
    create=extend_schema(tags=["Clinic Test"]),
    update=extend_schema(tags=["Clinic Test"]),
    partial_update=extend_schema(tags=["Clinic Test"]),
    destroy=extend_schema(tags=["Clinic Test"]),
)
class ClinicTestView(viewsets.ModelViewSet):
    queryset = ClinicTest.objects.all()
    serializer_class = ClinicTestSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["clinic", "test"]
