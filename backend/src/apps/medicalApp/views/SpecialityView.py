from ..models import Speciality, ClinicSpeciality
from ..serializers import SpecialitySerializer, BulkDeleteSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from guardian.shortcuts import assign_perm, get_objects_for_user
from django.db.models import Q, OuterRef, Exists, Subquery


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

    @extend_schema(
        tags=["Speciality"],
        request=None,
        responses={200: SpecialitySerializer(many=True)},
        summary="Specialities available for a clinic",
        description=(
            "Return specialities that are NOT currently active for the provided clinic. "
            "If a specialy is associated with the clinic but inactive, it will be returned and "
            "annotated with the clinicspeciality id so the frontend can re-activate it."
        ),
    )
    @action(detail=False, methods=["get"], url_path="available-for-clinic")
    def available_for_clinic(self, request):
        user = request.user
        clinic_id = request.query_params.get("clinic")
        if not clinic_id:
            return Response({"detail": "Missing required query parameter: clinic"}, status=status.HTTP_400_BAD_REQUEST)

        # Base Speciality queryset scoped to the user's enterprise and optionally to active specialities
        enterprise_id = getattr(user, "id", None)
        include_inactive_speciality = request.query_params.get("include_inactive_speciality", "false").lower() in (
            "1",
            "true",
            "yes",
        )

        base_qs = Speciality.objects.filter(Q(enterprise_user=enterprise_id))
        if not include_inactive_speciality:
            base_qs = base_qs.filter(status=Speciality.ACTIVE_STATUS)

        # Subqueries to detect a ClinicSpeciality relation for this clinic
        active_cs_q = ClinicSpeciality.objects.filter(
            clinic_id=clinic_id, speciality_id=OuterRef("pk"), status=ClinicSpeciality.ACTIVE_STATUS
        )
        inactive_cs_q = ClinicSpeciality.objects.filter(
            clinic_id=clinic_id, speciality_id=OuterRef("pk"), status=ClinicSpeciality.INACTIVE_STATUS
        )

        # Annotate whether an active clinicspeciality exists; annotate an inactive clinicspeciality id if present
        qs = base_qs.annotate(
            has_active=Exists(active_cs_q),
            inactive_clinic_speciality_id=Subquery(inactive_cs_q.values("id")[:1]),
        ).filter(
            has_active=False
        )  # exclude specialities that are already active in the clinic

        # Apply object-level view permissions
        qs = get_objects_for_user(
            user,
            "medicalApp.view_speciality",
            klass=qs,
            use_groups=True,
            any_perm=False,
            with_superuser=True,
            accept_global_perms=True,
        )

        # Optional search handled by DRF filter backends if configured; otherwise allow basic name filter
        q_search = request.query_params.get("search")
        if q_search:
            qs = qs.filter(name__icontains=q_search)

        # Pagination
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = SpecialitySerializer(page, many=True, context={"request": request})
            data = serializer.data
            # attach clinicspeciality metadata for each row where applicable
            for idx, obj in enumerate(page):
                cs_id = getattr(obj, "inactive_clinic_speciality_id", None)
                data[idx]["clinic_speciality"] = (
                    {"id": cs_id, "status": ClinicSpeciality.INACTIVE_STATUS} if cs_id else None
                )
            return self.get_paginated_response(data)

        serializer = SpecialitySerializer(qs, many=True, context={"request": request})
        data = serializer.data
        for idx, obj in enumerate(qs):
            cs_id = getattr(obj, "inactive_clinic_speciality_id", None)
            data[idx]["clinic_speciality"] = (
                {"id": cs_id, "status": ClinicSpeciality.INACTIVE_STATUS} if cs_id else None
            )
        return Response(serializer.data, status=status.HTTP_200_OK)
