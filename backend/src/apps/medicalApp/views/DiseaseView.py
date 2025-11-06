from rest_framework import viewsets, permissions
from rest_framework.pagination import LimitOffsetPagination
from ..models import Disease
from ..serializers import DiseaseSerializer, BulkDeleteSerializer, BulkUpdateSerializer
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
        request=BulkDeleteSerializer,
        responses={204: None, 400: "Bad Request"},
        summary="Bulk delete Diseases",
        description="Delete one or more diseases by IDs in bulk.",
    )
    @action(detail=False, methods=["delete"])
    def delete_bulk(self, request):
        serializer = BulkDeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]  # type: ignore
        self.queryset.filter(id__in=ids).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        tags=["Disease"],
        request=BulkUpdateSerializer,
        responses={200: None, 400: "Bad Request"},
        summary="Bulk update Diseases",
        description="Bulk update the status of one or more diseases by their IDs.",
    )
    @action(detail=False, methods=["put"])
    def update_bulk(self, request):
        serializer = BulkUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]  # type: ignore
        new_status = serializer.validated_data["status"]  # type: ignore
        self.queryset.filter(id__in=ids).update(status=new_status)
        return Response(status=status.HTTP_200_OK)
