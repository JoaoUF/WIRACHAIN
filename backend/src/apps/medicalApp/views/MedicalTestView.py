from rest_framework import viewsets, permissions
from ..models import MedicalTest
from ..serializers import MedicalTestSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Medical Test"]),
    retrieve=extend_schema(tags=["Medical Test"]),
    create=extend_schema(tags=["Medical Test"]),
    update=extend_schema(tags=["Medical Test"]),
    partial_update=extend_schema(tags=["Medical Test"]),
    destroy=extend_schema(tags=["Medical Test"]),
)
class MedicalTestView(viewsets.ModelViewSet):
    queryset = MedicalTest.objects.all()
    serializer_class = MedicalTestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["name", "status", "activate_date", "deactivate_date"]
