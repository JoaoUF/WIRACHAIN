from ..models import Clinic
from ..serializers import ClinicSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
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
    queryset = Clinic.objects.none()
    serializer_class = ClinicSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]
    filterset_fields = ["city", "region", "country"]
    search_fields = ["name"]
