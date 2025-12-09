from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import ClinicSpeciality, Clinic, Speciality
from ..serializers import ClinicSpecialitySerializer, BulkDeleteSerializer, ClinicBulkCreateSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema
from guardian.shortcuts import assign_perm, get_objects_for_user
from django.db import transaction


@extend_schema_view(
    list=extend_schema(tags=["Clinic Speciality"]),
    retrieve=extend_schema(tags=["Clinic Speciality"]),
    create=extend_schema(tags=["Clinic Speciality"]),
    update=extend_schema(tags=["Clinic Speciality"]),
    partial_update=extend_schema(tags=["Clinic Speciality"]),
    destroy=extend_schema(tags=["Clinic Speciality"]),
)
class ClinicSpecialityView(viewsets.ModelViewSet):
    queryset = ClinicSpeciality.objects.none()
    serializer_class = ClinicSpecialitySerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]
    filterset_fields = ["clinic", "speciality"]

    def get_queryset(self):
        user = self.request.user
        base_qs = (
            ClinicSpeciality.objects.filter(status=ClinicSpeciality.ACTIVE_STATUS)
            .select_related("clinic", "speciality")
            .all()
        )

        return get_objects_for_user(
            user,
            "medicalApp.view_clinicspeciality",
            klass=base_qs,
            use_groups=True,
            any_perm=False,
            with_superuser=True,
            accept_global_perms=True,
        )

    def perform_create(self, serializer):
        user = self.request.user

        if not user.has_perm("medicalApp.add_clinicspeciality"):
            raise PermissionDenied("You do not have permission to create ClinicSpeciality objects.")

        instance = serializer.save()
        owner = instance.enterprise_user

        assign_perm("medicalApp.view_clinicspeciality", owner, instance)
        assign_perm("medicalApp.change_clinicspeciality", owner, instance)

    def _ensure_obj_perm_or_403(self, user, perm_codename: str, obj):
        if user.has_perm(perm_codename, obj):
            return
        raise PermissionDenied("You do not have permission to perform this action on the requested object.")

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.view_clinicspeciality", obj)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_clinicspeciality", obj)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_clinicspeciality", obj)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.delete_clinicspeciality", obj)
        return super().destroy(request, *args, **kwargs)

    @extend_schema(
        tags=["Clinic Speciality"],
        request=ClinicBulkCreateSerializer,
        responses={201: ClinicSpecialitySerializer(many=True), 400: "Bad Request", 403: "Forbidden"},
        summary="Bulk create or reactivate clinic specialities by clinicId and speciality ids",
        description=(
            "Create multiple ClinicSpeciality objects for a clinic using a list of speciality IDs. "
            "If a (clinic, speciality) already exists but is inactive, it will be set to active. "
            "If it exists and is active, it will be returned as-is."
        ),
    )
    @action(detail=False, methods=["post"])
    def create_bulk(self, request):
        user = request.user
        if not user.has_perm("medicalApp.add_clinicspeciality"):
            raise PermissionDenied("You do not have permission to create ClinicSpeciality objects.")

        # validate payload
        serializer = self.ClinicBulkCreateSerializer(data=request.data)  # type: ignore
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data
        clinic_id = payload["clinic"]
        speciality_ids = payload["ids"]

        # fetch clinic
        try:
            clinic = Clinic.objects.get(pk=clinic_id)
        except Clinic.DoesNotExist:
            return Response({"detail": f"Clinic with id {clinic_id} not found."}, status=status.HTTP_400_BAD_REQUEST)

        # fetch specialities and check missing ones
        specialities_qs = Speciality.objects.filter(pk__in=speciality_ids)
        found_ids = set(str(s.pk) for s in specialities_qs)
        requested_ids = set(str(i) for i in speciality_ids)
        missing = requested_ids - found_ids
        if missing:
            return Response(
                {"detail": "Some specialities were not found.", "missing_ids": list(missing)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        specialities = list(specialities_qs)

        created_or_updated = []

        # Use transaction to avoid partial state on error
        with transaction.atomic():
            # Prefetch existing ClinicSpeciality for this clinic and these specialities
            existing_map = {
                (cs.speciality_id): cs  # type: ignore
                for cs in ClinicSpeciality.objects.filter(clinic=clinic, speciality__in=specialities)
            }

            for speciality in specialities:
                obj = existing_map.get(speciality.pk)
                if obj:
                    # If exists but inactive, reactivate
                    if getattr(obj, "status", None) == ClinicSpeciality.INACTIVE_STATUS:
                        obj.status = ClinicSpeciality.ACTIVE_STATUS
                        obj.save(update_fields=["status"])
                    # append existing (active or reactivated)
                    created_or_updated.append(obj)
                else:
                    # create new one
                    new_obj = ClinicSpeciality.objects.create(clinic=clinic, speciality=speciality)
                    created_or_updated.append(new_obj)

        # Assign object permissions to owners for each created/reactivated instance (only to user owner)
        for inst in created_or_updated:
            owner = getattr(inst, "enterprise_user", None) or getattr(
                getattr(inst, "clinic", None), "enterprise_user", None
            )
            if owner:
                assign_perm("medicalApp.view_clinicspeciality", owner, inst)
                assign_perm("medicalApp.change_clinicspeciality", owner, inst)

        out = ClinicSpecialitySerializer(created_or_updated, many=True)
        return Response(out.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        tags=["Clinic Speciality"],
        request=BulkDeleteSerializer,
        responses={200: None, 400: "Bad Request", 403: "Forbidden"},
        summary="Bulk deactivate clinic specialities",
        description="Deactivate multiple ClinicSpeciality objects by their IDs.",
    )
    @action(detail=False, methods=["put"])
    def deactivate_bulk(self, request):
        """
        Expects: {"ids": [<id1>, <id2>, ...]}
        Only objects the requesting user has change permission for will be updated.
        If some requested ids are not allowed, returns 403 with not_allowed_ids list.
        """
        user = request.user
        serializer = BulkDeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]  # type: ignore

        qs = self.get_queryset().filter(id__in=ids)
        # find objects where user has change permission
        permitted_objs = [o for o in qs if user.has_perm("medicalApp.change_clinicspeciality", o)]
        permitted_ids = {o.id for o in permitted_objs}
        requested_ids = set(ids)
        not_allowed = requested_ids - permitted_ids

        if not_allowed:
            return Response(
                {
                    "detail": "You don't have permission to deactivate some requested items.",
                    "not_allowed_ids": list(not_allowed),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        self.get_queryset().filter(id__in=permitted_ids).update(status=ClinicSpeciality.INACTIVE_STATUS)
        return Response(status=status.HTTP_200_OK)
