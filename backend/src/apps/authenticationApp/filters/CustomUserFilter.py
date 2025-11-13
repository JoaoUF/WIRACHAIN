import django_filters
from django_filters import rest_framework as filters
from ..models import CustomUser


class CharInFilter(filters.BaseInFilter, filters.CharFilter):
    pass


class CustomUserFilter(filters.FilterSet):
    gender = django_filters.CharFilter()
    is_active = django_filters.BooleanFilter()
    role = CharInFilter(field_name="groups__name", lookup_expr="in")

    class Meta:
        model = CustomUser
        fields = ["gender", "is_active", "role"]
