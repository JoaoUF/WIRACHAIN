from rest_framework import viewsets, mixins
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import CustomUser
from ..serializers import CustomUserSerializer
from ..filters import CustomUserFilter
from rest_framework import status


class CurrentUserView(APIView):
    def get(self, request):
        user = request.user

        return Response(
            {
                "user_id": user.id,
                "email": user.email,
                "document_value": user.document_value,
                "groups": list(user.groups.values_list("name", flat=True))[0],
                "enterprise_id": user.enterprise,
            },
            status=status.HTTP_200_OK,
        )


@extend_schema_view(
    list=extend_schema(tags=["Users"]),
    retrieve=extend_schema(tags=["Users"]),
    create=extend_schema(tags=["Users"]),
    update=extend_schema(tags=["Users"]),
    partial_update=extend_schema(tags=["Users"]),
    destroy=extend_schema(tags=["Users"]),
)
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated]
    filterset_class = CustomUserFilter


@extend_schema_view(
    list=extend_schema(tags=["Users"]),
)
class AdminUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(groups__name="ADMIN")
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filterset_class = CustomUserFilter


@extend_schema_view(
    list=extend_schema(tags=["Users"]),
)
class ClinicUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(
        groups__name__in=[
            "ENTERPRISE_BASIC",
            "ENTERPRISE_PREMIUM",
            "ENTERPRISE_PROFESSISONAL",
        ]
    ).distinct()
    serializer_class = CustomUserSerializer
    filterset_class = CustomUserFilter


@extend_schema_view(
    list=extend_schema(tags=["Users"]),
)
class DoctorUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(groups__name="DOCTOR")
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsDoctor]
    filterset_class = CustomUserFilter


@extend_schema_view(
    list=extend_schema(tags=["Users"]),
)
class PatientUserListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = CustomUser.objects.filter(groups__name="PATIENT")
    serializer_class = CustomUserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsPatient]
    filterset_class = CustomUserFilter
