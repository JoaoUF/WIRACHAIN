from ..models import CustomUser
from ..serializers import CustomUserSerializer
from ..filters import CustomUserFilter
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from medicalApp.serializers import BulkDeleteSerializer
from drf_spectacular.utils import extend_schema_view, extend_schema
from guardian.shortcuts import assign_perm, get_objects_for_user


class CurrentUserView(APIView):
    def get(self, request):
        user = request.user

        try:
            groups = list(user.groups.values_list("name", flat=True))
            group_name = groups[0] if groups else None
        except Exception:
            group_name = None

        data = {
            "user_id": getattr(user, "pk", None),
            "email": getattr(user, "email", None),
            "document_value": getattr(user, "document_value", None),
            "groups": group_name,
            "enterprise_id": getattr(user, "enterprise_id", None),
        }

        return Response(data, status=status.HTTP_200_OK)


@extend_schema_view(
    list=extend_schema(tags=["Users"]),
    retrieve=extend_schema(tags=["Users"]),
    create=extend_schema(tags=["Users"]),
    update=extend_schema(tags=["Users"]),
    partial_update=extend_schema(tags=["Users"]),
    destroy=extend_schema(tags=["Users"]),
)
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.active()  # type: ignore
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]
    filterset_class = CustomUserFilter
    search_fields = ["email", "document_value"]

    def get_queryset(self):
        user = self.request.user
        base_qs = CustomUser.objects.active()  # type: ignore

        return get_objects_for_user(
            user,
            "authenticationApp.view_customuser",
            klass=base_qs,
            use_groups=True,
            any_perm=False,
            with_superuser=True,
            accept_global_perms=True,
        )

    def perform_create(self, serializer):
        user = self.request.user

        if not user.has_perm("authenticationApp.add_customuser"):
            raise PermissionDenied("You do not have permission to create Test objects.")

        instance = serializer.save()
        owner = instance.enterprise_user

        assign_perm("medicalApp.view_test", owner, instance)
        assign_perm("medicalApp.change_test", owner, instance)
        assign_perm("medicalApp.view_test", instance, instance)
        assign_perm("medicalApp.change_test", instance, instance)

    def _ensure_obj_perm_or_403(self, user, perm_codename: str, obj):
        if user.has_perm(perm_codename, obj):
            return
        raise PermissionDenied("You do not have permission to perform this action on the requested object.")

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "authenticationApp.view_customuser", obj)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "authenticationApp.change_customuser", obj)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "authenticationApp.change_customuser", obj)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        self._ensure_obj_perm_or_403(request.user, "authenticationApp.delete_customuser", obj)
        return super().destroy(request, *args, **kwargs)

    @extend_schema(
        tags=["Users"],
        request=BulkDeleteSerializer,
        responses={200: None, 400: "Bad Request"},
        summary="Bulk remove customuser",
        description="Bulk delete one or more customuser by their IDs.",
    )
    @action(detail=False, methods=["put"])
    def update_bulk(self, request):
        serializer = BulkDeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]  # type: ignore

        updatable_qs = self.get_queryset().filter(id__in=ids)
        updatable_ids = [o.id for o in updatable_qs if request.user.has_perm("authenticationApp.change_customuser", o)]
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

        self.queryset.filter(id__in=updatable_ids).update(status=0)
        return Response(status=status.HTTP_200_OK)
