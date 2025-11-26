from ..models import Speciality
from ..serializers import SpecialitySerializer, BulkDeleteSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from guardian.shortcuts import assign_perm, get_objects_for_user
from django.db.models import Q


@extend_schema_view(
    list=extend_schema(tags=["Speciality"]),
    retrieve=extend_schema(tags=["Speciality"]),
    create=extend_schema(tags=["Speciality"]),
    update=extend_schema(tags=["Speciality"]),
    partial_update=extend_schema(tags=["Speciality"]),
    destroy=extend_schema(tags=["Speciality"]),
)
class SpecialityView(viewsets.ModelViewSet):
    queryset = Speciality.objects.none()
    serializer_class = SpecialitySerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]
    search_fields = ["name"]

    def get_queryset(self):
        user = self.request.user
        enterprise_id = getattr(user, "id", None)
        base_qs = Speciality.objects.filter(Q(enterprise_user=enterprise_id) & Q(status=Speciality.ACTIVE_STATUS)).only(
            "id",
            "name",
            "description",
        )

        return get_objects_for_user(
            user,
            "medicalApp.view_speciality",
            klass=base_qs,
            use_groups=True,
            any_perm=False,
            with_superuser=True,
            accept_global_perms=True,
        )

    def perform_create(self, serializer):
        user = self.request.user

        if not user.has_perm("medicalApp.add_speciality"):
            raise PermissionDenied("You do not have permission to create Speciality objects.")

        instance = serializer.save()
        owner = instance.enterprise_user

        assign_perm("medicalApp.view_speciality", owner, instance)
        assign_perm("medicalApp.change_speciality", owner, instance)

    def _ensure_obj_perm_or_403(self, user, perm_codename: str, obj):
        if user.has_perm(perm_codename, obj):
            return
        raise PermissionDenied("You do not have permission to perform this action on the requested object.")

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.view_speciality", obj)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_speciality", obj)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_speciality", obj)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.delete_speciality", obj)
        return super().destroy(request, *args, **kwargs)

    @extend_schema(
        tags=["Speciality"],
        request=BulkDeleteSerializer,
        responses={200: None, 400: "Bad Request"},
        summary="Bulk update Speciality",
        description="Bulk update the status of one or more speciality by their IDs.",
    )
    @action(detail=False, methods=["put"])
    def update_bulk(self, request):
        serializer = BulkDeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]  # type: ignore

        updatable_qs = self.get_queryset().filter(id__in=ids)
        updatable_ids = [o.id for o in updatable_qs if request.user.has_perm("medicalApp.change_speciality", o)]
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

        self.get_queryset().filter(id__in=updatable_ids).update(status=Speciality.INACTIVE_STATUS)
        return Response(status=status.HTTP_200_OK)
