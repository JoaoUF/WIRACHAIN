from ..models import ClinicSchedule
from ..serializers import ClinicScheduleSerializer, BulkDeleteSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.throttling import UserRateThrottle
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from guardian.shortcuts import assign_perm, get_objects_for_user
from django.db.models import Q


@extend_schema_view(
    list=extend_schema(tags=["Clinic Schedule"]),
    retrieve=extend_schema(tags=["Clinic Schedule"]),
    create=extend_schema(tags=["Clinic Schedule"]),
    update=extend_schema(tags=["Clinic Schedule"]),
    partial_update=extend_schema(tags=["Clinic Schedule"]),
    destroy=extend_schema(tags=["Clinic Schedule"]),
)
class ClinicScheduleView(viewsets.ModelViewSet):
    queryset = ClinicSchedule.objects.none()
    serializer_class = ClinicScheduleSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]
    filterset_fields = ["clinic"]

    def get_queryset(self):
        user = self.request.user
        base_qs = (
            ClinicSchedule.objects.select_related("clinic")
            .filter(Q(status=ClinicSchedule.ACTIVE_STATUS))
            .only(
                "id",
                "clinic",
                "day_of_week",
                "day_of_week_display",
                "open_time",
                "close_time",
            )
        )

        return get_objects_for_user(
            user,
            "medicalApp.view_clinicschedule",
            klass=base_qs,
            use_groups=True,
            any_perm=False,
            with_superuser=True,
            accept_global_perms=True,
        )

    def perform_create(self, serializer):
        user = self.request.user

        if not user.has_perm("medicalApp.add_clinicschedule"):
            raise PermissionDenied("You do not have permission to create Clinic Schedule objects.")

        instance = serializer.save()
        owner = instance.enterprise_user

        assign_perm("medicalApp.view_clinicschedule", owner, instance)
        assign_perm("medicalApp.change_clinicschedule", owner, instance)

    def _ensure_obj_perm_or_403(self, user, perm_codename: str, obj):
        if user.has_perm(perm_codename, obj):
            return
        raise PermissionDenied("You do not have permission to perform this action on the requested object.")

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.view_clinicschedule", obj)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_clinicschedule", obj)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.change_clinicschedule", obj)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "medicalApp.delete_clinicschedule", obj)
        return super().destroy(request, *args, **kwargs)

    @extend_schema(
        tags=["Clinic Schedule"],
        request=BulkDeleteSerializer,
        responses={200: None, 400: "Bad Request"},
        summary="Bulk update clinic scheduel",
        description="Bulk update the status of one or more clinic schedules by their IDs.",
    )
    @action(detail=False, methods=["put"])
    def delete_bulk(self, request):
        serializer = BulkDeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]  # type: ignore

        updatable_qs = self.get_queryset().filter(id__in=ids)
        updatable_ids = [o.id for o in updatable_qs if request.user.has_perm("medicalApp.change_clinicschedule", o)]
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

        self.get_queryset().filter(id__in=updatable_ids).update(status=ClinicSchedule.INACTIVE_STATUS)
        return Response(status=status.HTTP_200_OK)

    @extend_schema(
        tags=["Clinic Schedule"],
        request=ClinicScheduleSerializer(many=True),
        responses={201: ClinicScheduleSerializer(many=True), 400: "Bad Request", 403: "Forbidden"},
        summary="Bulk create clinic schedules",
        description="Create multiple ClinicSchedule objects in a single request.",
    )
    @action(detail=False, methods=["post"])
    def create_bulk(self, request):
        user = request.user
        if not user.has_perm("medicalApp.add_clinicschedule"):
            raise PermissionDenied("You do not have permission to create Clinic Schedule objects.")

        serializer = ClinicScheduleSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        instances = serializer.save()

        for inst in instances:
            owner = getattr(inst, "enterprise_user", None)
            if owner:
                assign_perm("medicalApp.view_clinicschedule", owner, inst)
                assign_perm("medicalApp.change_clinicschedule", owner, inst)

        out_serializer = ClinicScheduleSerializer(instances, many=True)
        return Response(out_serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        tags=["Clinic Schedule"],
        request=ClinicScheduleSerializer(many=True),
        responses={200: None, 400: "Bad Request", 403: "Forbidden"},
        summary="Bulk update clinic schedules",
        description="Update multiple ClinicSchedule objects. Each item must include `id` and the fields to update.",
    )
    @action(detail=False, methods=["put"])
    def update_bulk(self, request):
        # Validate incoming list of update items
        serializer = ClinicScheduleSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        items = serializer.validated_data

        # Collect ids and ensure permission per-object
        ids = [item["id"] for item in items]  # type: ignore
        qs = self.get_queryset().filter(id__in=ids)
        permitted_objs = [o for o in qs if request.user.has_perm("medicalApp.change_clinicschedule", o)]
        permitted_ids = {o.id for o in permitted_objs}
        requested_ids = set(ids)
        not_allowed = requested_ids - permitted_ids

        if not_allowed:
            return Response(
                {
                    "detail": "You don't have permission to update some requested items.",
                    "not_allowed_ids": list(not_allowed),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Apply updates per object (keeps model save hooks and signals)
        id_to_obj = {o.id: o for o in permitted_objs}
        updated_instances = []
        for item in items:  # type: ignore
            obj = id_to_obj.get(item["id"])
            # update allowed fields
            changed = False
            for field in ("day_of_week", "open_time", "close_time", "status"):
                if field in item:
                    setattr(obj, field, item[field])
                    changed = True
            if changed:
                obj.save()  # type: ignore
                updated_instances.append(obj)

        return Response(status=status.HTTP_200_OK)
