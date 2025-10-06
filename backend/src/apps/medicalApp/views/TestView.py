from rest_framework import viewsets, permissions
from ..models import Test
from ..serializers import TestSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Test"]),
    retrieve=extend_schema(tags=["Test"]),
    create=extend_schema(tags=["Test"]),
    update=extend_schema(tags=["Test"]),
    partial_update=extend_schema(tags=["Test"]),
    destroy=extend_schema(tags=["Test"]),
)
class TestView(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["name", "status", "activate_date", "deactivate_date"]
    search_fields = ["name"]
