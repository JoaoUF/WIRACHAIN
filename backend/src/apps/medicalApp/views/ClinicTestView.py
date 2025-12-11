from ..models import ClinicTest, Clinic, Test
from ..serializers import ClinicTestSerializer, ClinicBulkCreateSerializer, BulkDeleteSerializer

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema_view, extend_schema
from guardian.shortcuts import assign_perm, get_objects_for_user
from django.db import transaction


@extend_schema_view(
    list=extend_schema(tags=["Clinic Test"]),
    retrieve=extend_schema(tags=["Clinic Test"]),
    create=extend_schema(tags=["Clinic Test"]),
    update=extend_schema(tags=["Clinic Test"]),
    partial_update=extend_schema(tags=["Clinic Test"]),
    destroy=extend_schema(tags=["Clinic Test"]),
)
class ClinicTestView(viewsets.ModelViewSet):
    queryset = ClinicTest.objects.none()
    serializer_class = ClinicTestSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]
    filterset_fields = ["clinic", "test"]

    def get_queryset(self):
        user = self.request.user
        base_qs = ClinicTest.objects.filter(status=ClinicTest.ACTIVE_STATUS).select_related("clinic", "test").all()

        return get_objects_for_user(
            user,
            "medicalApp.view_clinictest",
            klass=base_qs,
            use_groups=True,
            any_perm=False,
            with_superuser=True,
            accept_global_perms=True,
        )

    def perform_create(self, serializer):
        user = self.request.user

        if not user.has_perm("medicalApp.add_clinictest"):
            raise PermissionDenied("You do not have permission to create ClinicTest objects.")

        instance = serializer.save()
        owner = instance.enterprise_user

        assign_perm("medicalApp.view_clinictest", owner, instance)
        assign_perm("medicalApp.change_clinictest", owner, instance)

    def _ensure_obj_perm_or_403(self, user, perm_codename: str, obj):
        if user.has_perm(perm_codename, obj):
            return
        raise PermissionDenied("You do not have permission to perform this action on the requested object.")

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.view_clinictest", obj)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_clinictest", obj)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_clinictest", obj)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.delete_clinictest", obj)
        return super().destroy(request, *args, **kwargs)

    @extend_schema(
        tags=["Clinic Test"],
        request=ClinicBulkCreateSerializer,
        responses={201: ClinicTestSerializer(many=True), 400: "Bad Request", 403: "Forbidden"},
        summary="Bulk create or reactivate clinic tests by clinicId and test ids",
        description=(
            "Create multiple ClinicTest objects for a clinic using a list of test IDs. "
            "If a (clinic, test) already exists but is inactive, it will be set to active. "
            "If it exists and is active, it will be returned as-is."
        ),
    )
    @action(detail=False, methods=["post"])
    def create_bulk(self, request):
        user = request.user
        if not user.has_perm("medicalApp.add_clinictest"):
            raise PermissionDenied("You do not have permission to create ClinicTest objects.")

        # validate payload
        serializer = ClinicBulkCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data
        clinic_id = payload["clinic"]  # type: ignore
        test_ids = payload["ids"]  # type: ignore

        # fetch clinic
        try:
            clinic = Clinic.objects.get(pk=clinic_id)
        except Clinic.DoesNotExist:
            return Response({"detail": f"Clinic with id {clinic_id} not found."}, status=status.HTTP_400_BAD_REQUEST)

        # fetch tests and check missing ones
        tests_qs = Test.objects.filter(pk__in=test_ids)
        found_ids = set(str(s.pk) for s in tests_qs)
        requested_ids = set(str(i) for i in test_ids)
        missing = requested_ids - found_ids
        if missing:
            return Response(
                {"detail": "Some tests were not found.", "missing_ids": list(missing)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        tests = list(tests_qs)

        created_or_updated = []

        # Use transaction to avoid partial state on error
        with transaction.atomic():
            # Prefetch existing ClinicTest for this clinic and these tests
            existing_map = {cs.test_id: cs for cs in ClinicTest.objects.filter(clinic=clinic, test__in=tests)}  # type: ignore

            for test in tests:
                obj = existing_map.get(test.pk)
                if obj:
                    # If exists but inactive, reactivate
                    if getattr(obj, "status", None) == ClinicTest.INACTIVE_STATUS:
                        obj.status = ClinicTest.ACTIVE_STATUS
                        obj.save(update_fields=["status"])
                    # append existing (active or reactivated)
                    created_or_updated.append(obj)
                else:
                    # create new one
                    new_obj = ClinicTest.objects.create(clinic=clinic, test=test)
                    created_or_updated.append(new_obj)

        # Assign object permissions to owners for each created/reactivated instance (only to user owner)
        for inst in created_or_updated:
            owner = getattr(inst, "enterprise_user", None) or getattr(
                getattr(inst, "clinic", None), "enterprise_user", None
            )
            if owner:
                assign_perm("medicalApp.view_clinictest", owner, inst)
                assign_perm("medicalApp.change_clinictest", owner, inst)

        out = ClinicTestSerializer(created_or_updated, many=True)
        return Response(out.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        tags=["Clinic Test"],
        request=BulkDeleteSerializer,
        responses={200: None, 400: "Bad Request", 403: "Forbidden"},
        summary="Bulk deactivate clinic tests",
        description="Deactivate multiple ClinicTest objects by their IDs.",
    )
    @action(detail=False, methods=["put"])
    def deactivate_bulk(self, request):
        user = request.user
        serializer = BulkDeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]  # type: ignore

        qs = self.get_queryset().filter(id__in=ids)
        # find objects where user has change permission
        permitted_objs = [o for o in qs if user.has_perm("medicalApp.change_clinictest", o)]
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

        self.get_queryset().filter(id__in=permitted_ids).update(status=ClinicTest.INACTIVE_STATUS)
        return Response(status=status.HTTP_200_OK)
