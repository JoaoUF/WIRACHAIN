from rest_framework import viewsets, permissions
from ..models import Disease
from ..serializers import DiseaseSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Disease"]),
    retrieve=extend_schema(tags=["Disease"]),
    create=extend_schema(tags=["Disease"]),
    update=extend_schema(tags=["Disease"]),
    partial_update=extend_schema(tags=["Disease"]),
    destroy=extend_schema(tags=["Disease"]),
)
class DiseaseView(viewsets.ModelViewSet):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["name", "status", "activate_date", "deactivate_date"]
    ordering = ["-created"]
    search_fields = ["name"]
