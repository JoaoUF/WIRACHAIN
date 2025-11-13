from rest_framework import viewsets, mixins
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import CustomUser
from ..serializers import CustomUserSerializer
from ..filters import CustomUserFilter
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from authenticationApp.permissions import IsAdminOrEnterprise


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
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated, IsAdminOrEnterprise]
    filterset_class = CustomUserFilter
    search_fields = ["email", "document_value"]
