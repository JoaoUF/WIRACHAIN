import django_filters
from ..models import CustomUser


class CustomUserFilter(django_filters.FilterSet):
    email = django_filters.CharFilter(lookup_expr="icontains")
    gender = django_filters.CharFilter()
    document_type = django_filters.CharFilter()
    is_active = django_filters.BooleanFilter()

    class Meta:
        model = CustomUser
        fields = ["email", "gender", "document_type", "is_active"]
