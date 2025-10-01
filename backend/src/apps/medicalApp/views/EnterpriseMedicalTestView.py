from rest_framework import viewsets, permissions
from ..models import EnterpriseMedicalTest
from ..serializers import EnterpriseMedicalTestSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema


@extend_schema_view(
    list=extend_schema(tags=["Enterprise Medical Test"]),
    retrieve=extend_schema(tags=["Enterprise Medical Test"]),
    create=extend_schema(tags=["Enterprise Medical Test"]),
    update=extend_schema(tags=["Enterprise Medical Test"]),
    partial_update=extend_schema(tags=["Enterprise Medical Test"]),
    destroy=extend_schema(tags=["Enterprise Medical Test"]),
)
class EnterpriseMedicalTestView(viewsets.ModelViewSet):
    queryset = EnterpriseMedicalTest.objects.all()
    serializer_class = EnterpriseMedicalTestSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["enterprise_user", "medical_test"]
