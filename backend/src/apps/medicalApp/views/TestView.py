from ..models import Test
from ..serializers import TestSerializer, BulkDeleteSerializer, BulkUpdateSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema
from authenticationApp.permissions import IsAdminOrEnterprise
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


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
    permission_classes = [IsAuthenticated, IsAdminOrEnterprise]
    filterset_fields = ["name", "status"]
    search_fields = ["name"]

    @extend_schema(
        tags=["Test"],
        request=BulkDeleteSerializer,
        responses={204: None, 400: "Bad Request"},
        summary="Bulk delete Test",
        description="Delete one or more tests by IDs in bulk.",
    )
    @action(detail=False, methods=["delete"])
    def delete_bulk(self, request):
        serializer = BulkDeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]  # type: ignore
        self.queryset.filter(id__in=ids).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        tags=["Test"],
        request=BulkUpdateSerializer,
        responses={200: None, 400: "Bad Request"},
        summary="Bulk update Tests",
        description="Bulk update the status of one or more tests by their IDs.",
    )
    @action(detail=False, methods=["put"])
    def update_bulk(self, request):
        serializer = BulkUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]  # type: ignore
        new_status = serializer.validated_data["status"]  # type: ignore
        self.queryset.filter(id__in=ids).update(status=new_status)
        return Response(status=status.HTTP_200_OK)
