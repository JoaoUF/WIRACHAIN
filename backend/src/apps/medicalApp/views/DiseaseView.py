from rest_framework import viewsets, permissions
from rest_framework.pagination import LimitOffsetPagination
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
    pagination_class = LimitOffsetPagination
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["enterprise_user", "status"]
    search_fields = ["name"]
