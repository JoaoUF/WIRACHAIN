from rest_framework import viewsets
from ..models import Disease
from ..serializers import DiseaseSerializer, BulkDeleteSerializer, BulkUpdateSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from guardian.shortcuts import assign_perm, get_objects_for_user


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
    permission_classes = [IsAuthenticated]
    filterset_fields = ["enterprise_user", "status"]
    search_fields = ["name"]

    def get_queryset(self):
        user = self.request.user
        base_qs = Disease.objects.all()

        return get_objects_for_user(
            user,
            "medicalApp.view_disease",
            klass=base_qs,
            use_groups=True,
            any_perm=False,
            with_superuser=True,
            accept_global_perms=True,
        )

    def perform_create(self, serializer):
        user = self.request.user

        if not user.has_perm("medicalApp.add_disease"):
            raise PermissionDenied("You do not have permission to create Disease objects.")

        instance = serializer.save()
        owner = instance.enterprise_user

        assign_perm("medicalApp.view_disease", owner, instance)
        assign_perm("medicalApp.change_disease", owner, instance)
        assign_perm("medicalApp.delete_disease", owner, instance)

    def _ensure_obj_perm_or_403(self, user, perm_codename: str, obj):
        if user.has_perm(perm_codename, obj):
            return
        raise PermissionDenied("You do not have permission to perform this action on the requested object.")

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.view_disease", obj)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_disease", obj)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_disease", obj)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.delete_disease", obj)
        return super().destroy(request, *args, **kwargs)

    @extend_schema(
        tags=["Disease"],
        request=BulkDeleteSerializer,
        responses={204: None, 400: "Bad Request", 403: "Forbidden"},
        summary="Bulk delete Diseases",
        description="Delete one or more diseases by IDs in bulk.",
    )
    @action(detail=False, methods=["delete"])
    def delete_bulk(self, request):
        serializer = BulkDeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]  # type: ignore

        deletable_qs = self.get_queryset().filter(id__in=ids)
        deletable_ids = [o.id for o in deletable_qs if request.user.has_perm("medicalApp.delete_disease", o)]
        requested_ids = set(ids)
        not_allowed = requested_ids - set(deletable_ids)
        if not_allowed:
            return Response(
                {
                    "detail": "You don't have permission to delete some requested items.",
                    "not_allowed_ids": list(not_allowed),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        self.queryset.filter(id__in=deletable_ids).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        tags=["Disease"],
        request=BulkUpdateSerializer,
        responses={200: None, 400: "Bad Request", 403: "Forbidden"},
        summary="Bulk update Diseases",
        description="Bulk update the status of one or more diseases by their IDs.",
    )
    @action(detail=False, methods=["put"])
    def update_bulk(self, request):
        serializer = BulkUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]  # type: ignore
        new_status = serializer.validated_data["status"]  # type: ignore

        updatable_qs = self.get_queryset().filter(id__in=ids)
        updatable_ids = [o.id for o in updatable_qs if request.user.has_perm("medicalApp.change_disease", o)]
        requested_ids = set(ids)
        not_allowed = requested_ids - set(updatable_ids)
        if not_allowed:
            return Response(
                {
                    "detail": "You don't have permission to update some requested items.",
                    "not_allowed_ids": list(not_allowed),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        self.queryset.filter(id__in=updatable_ids).update(status=new_status)
        return Response(status=status.HTTP_200_OK)
