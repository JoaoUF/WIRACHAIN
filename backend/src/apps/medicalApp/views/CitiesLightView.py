from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.viewsets import ReadOnlyModelViewSet
from cities_light.models import Country, Region, City, SubRegion
from ..serializers import (
    CustomSubRegionSerializer,
    CustomCitySerializer,
    CustomCountrySerializer,
    CustomRegionSerializer,
)


@extend_schema_view(
    list=extend_schema(tags=["Cities light"], summary="List all countries"),
    retrieve=extend_schema(tags=["Cities light"], summary="Retrieve a country"),
)
class CustomCountryModelViewSet(ReadOnlyModelViewSet):
    queryset = Country.objects.only(
        "id",
        "name",
        "code2",
        "phone",
    )
    serializer_class = CustomCountrySerializer


@extend_schema_view(
    list=extend_schema(tags=["Cities light"], summary="List all regions"),
    retrieve=extend_schema(tags=["Cities light"], summary="Retrieve a region"),
)
class CustomRegionModelViewSet(ReadOnlyModelViewSet):
    queryset = Region.objects.only(
        "id",
        "name",
    )
    serializer_class = CustomRegionSerializer
    filterset_fields = ["country"]
    search_fields = ["name"]


@extend_schema_view(
    list=extend_schema(tags=["Cities light"], summary="List all subregions"),
    retrieve=extend_schema(tags=["Cities light"], summary="Retrieve a subregion"),
)
class CustomSubRegionModelViewSet(ReadOnlyModelViewSet):
    queryset = SubRegion.objects.only(
        "id",
        "name",
    )
    serializer_class = CustomSubRegionSerializer
    filterset_fields = ["region"]
    search_fields = ["name"]


@extend_schema_view(
    list=extend_schema(tags=["Cities light"], summary="List all cities"),
    retrieve=extend_schema(tags=["Cities light"], summary="Retrieve a city"),
)
class CustomCityModelViewSet(ReadOnlyModelViewSet):
    queryset = City.objects.only(
        "id",
        "name",
    )
    serializer_class = CustomCitySerializer
    filterset_fields = ["subregion", "region"]
    search_fields = ["name"]
