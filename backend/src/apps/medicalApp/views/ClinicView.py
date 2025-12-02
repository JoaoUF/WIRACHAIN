from ..models import Clinic
from ..serializers import ClinicSerializer, BulkDeleteSerializer, ClinicDetailSerializer, ClinicListSerializer
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema_view, extend_schema
from guardian.shortcuts import assign_perm, get_objects_for_user
from django.db.models import Q


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
    filterset_fields = ["city__name", "region__name", "country__name"]
    search_fields = ["name", "email"]

    def get_serializer_class(self):
        if self.action == "list":
            return ClinicListSerializer
        return ClinicDetailSerializer

    def get_queryset(self):
        user = self.request.user
        enterprise_id = getattr(user, "id", None)
        base_qs = Clinic.objects.filter(
            Q(enterprise_user=enterprise_id) & Q(status=Clinic.ACTIVE_STATUS)
        ).select_related("city", "region", "country")

        # posible error for not geting region (which is selected 2 lines aboved)???
        if getattr(self, "action", None) == "list":
            base_qs = base_qs.only("id", "name", "email", "country", "region")

        if getattr(self, "action", None) == "retrieve":
            base_qs = base_qs.only(
                "id",
                "name",
                "email",
                "website_url",
                "phone",
                "address",
                "enterprise_user",
                "city",
                "region",
                "country",
            )

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

        if not user.has_perm("medicalApp.add_clinic"):
            raise PermissionDenied("You do not have permission to create Clinic objects.")

        instance = serializer.save()
        owner = instance.enterprise_user

        assign_perm("medicalApp.view_clinic", owner, instance)
        assign_perm("medicalApp.change_clinic", owner, instance)

    def _ensure_obj_perm_or_403(self, user, perm_codename: str, obj):
        if user.has_perm(perm_codename, obj):
            return
        raise PermissionDenied("You do not have permission to perform this action on the requested object.")

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.view_clinic", obj)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_clinic", obj)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_clinic", obj)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.delete_clinic", obj)
        return super().destroy(request, *args, **kwargs)

    @extend_schema(
        tags=["Clinic"],
        request=BulkDeleteSerializer,
        responses={200: None, 400: "Bad Request"},
        summary="Bulk update Clinic",
        description="Bulk update the status of one or more clinic by their IDs.",
    )
    @action(detail=False, methods=["put"])
    def update_bulk(self, request):
        serializer = BulkDeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]  # type: ignore

        updatable_qs = self.get_queryset().filter(id__in=ids)
        updatable_ids = [o.id for o in updatable_qs if request.user.has_perm("medicalApp.change_clinic", o)]
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

        self.get_queryset().filter(id__in=updatable_ids).update(status=Clinic.INACTIVE_STATUS)
        return Response(status=status.HTTP_200_OK)
