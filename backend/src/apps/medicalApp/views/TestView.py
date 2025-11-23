from ..models import Test
from ..serializers import TestSerializer, BulkDeleteSerializer, BulkUpdateSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.throttling import UserRateThrottle
from guardian.shortcuts import assign_perm, get_objects_for_user


@extend_schema_view(
    list=extend_schema(tags=["Test"]),
    retrieve=extend_schema(tags=["Test"]),
    create=extend_schema(tags=["Test"]),
    update=extend_schema(tags=["Test"]),
    partial_update=extend_schema(tags=["Test"]),
    destroy=extend_schema(tags=["Test"]),
)
class TestView(viewsets.ModelViewSet):
    queryset = Test.objects.active()  # type: ignore
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]
    filterset_fields = ["name", "status"]
    search_fields = ["name"]

    def get_queryset(self):
        user = self.request.user
        base_qs = Test.objects.active()  # type: ignore

        return get_objects_for_user(
            user,
            "medicalApp.view_test",
            klass=base_qs,
            use_groups=True,
            any_perm=False,
            with_superuser=True,
            accept_global_perms=True,
        )

    def perform_create(self, serializer):
        user = self.request.user

        if not user.has_perm("medicalApp.add_test"):
            raise PermissionDenied("You do not have permission to create Test objects.")

        instance = serializer.save()
        owner = instance.enterprise_user

        assign_perm("medicalApp.view_test", owner, instance)
        assign_perm("medicalApp.change_test", owner, instance)

    def _ensure_obj_perm_or_403(self, user, perm_codename: str, obj):
        if user.has_perm(perm_codename, obj):
            return
        raise PermissionDenied("You do not have permission to perform this action on the requested object.")

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.view_test", obj)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_test", obj)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_test", obj)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.delete_test", obj)
        return super().destroy(request, *args, **kwargs)

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

        deletable_qs = self.get_queryset().filter(id__in=ids)
        deletable_ids = [o.id for o in deletable_qs if request.user.has_perm("medicalApp.delete_test", o)]
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

        updatable_qs = self.get_queryset().filter(id__in=ids)
        updatable_ids = [o.id for o in updatable_qs if request.user.has_perm("medicalApp.change_test", o)]
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
