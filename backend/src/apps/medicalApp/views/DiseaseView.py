from rest_framework import viewsets, permissions
from rest_framework.pagination import LimitOffsetPagination
from ..models import Disease
from ..serializers import DiseaseSerializer, BulkDeleteDiseaseSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


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

    @extend_schema(
        tags=["Disease"],
        request=BulkDeleteDiseaseSerializer,
        responses={204: None, 400: "Bad Request"},
        summary="Bulk delete Diseases",
        description="Delete one or more diseases by IDs in bulk.",
    )
    @action(detail=False, methods=["delete"])
    def delete_bulk(self, request):
        serializer = BulkDeleteDiseaseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]  # type: ignore
        self.queryset.filter(id__in=ids).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
