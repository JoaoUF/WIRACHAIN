from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import ClinicSpeciality
from ..serializers import ClinicSpecialitySerializer, BulkDeleteSerializer
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
        request=ClinicSpecialitySerializer(many=True),
        responses={201: ClinicSpecialitySerializer(many=True), 400: "Bad Request", 403: "Forbidden"},
        summary="Bulk create or reactivate clinic specialities",
        description=(
            "Create multiple ClinicSpeciality objects in a single request. "
            "If a (clinic, speciality) already exists but is inactive, it will be set to active. "
            "If it exists and is active, it will be returned as-is."
        ),
    )
    @action(detail=False, methods=["post"])
    def create_bulk(self, request):
        user = request.user
        if not user.has_perm("medicalApp.add_clinicspeciality"):
            raise PermissionDenied("You do not have permission to create ClinicSpeciality objects.")

        serializer = ClinicSpecialitySerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        items = serializer.validated_data  # list of dicts with 'clinic' and 'speciality' (models)

        created_or_updated = []

        # Wrap in transaction to reduce partial-saves in case of error
        with transaction.atomic():
            for item in items:  # type: ignore
                clinic = item["clinic"]
                speciality = item["speciality"]

                # Try to get existing record (regardless of status)
                obj = ClinicSpeciality.objects.filter(clinic=clinic, speciality=speciality).first()
                if obj:
                    # If it exists but is inactive, reactivate
                    if getattr(obj, "status", None) == ClinicSpeciality.INACTIVE_STATUS:
                        obj.status = ClinicSpeciality.ACTIVE_STATUS
                        obj.save()
                    # if active, leave as-is
                    created_or_updated.append(obj)
                else:
                    # Create new one and assign perms afterward
                    new_obj = ClinicSpeciality.objects.create(clinic=clinic, speciality=speciality)
                    created_or_updated.append(new_obj)

        # Assign object permissions to owners for each created/reactivated instance
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
