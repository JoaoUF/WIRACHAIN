from drf_spectacular.utils import extend_schema_view, extend_schema
from cities_light.contrib.restframework3 import (
    CityModelViewSet,
    CountryModelViewSet,
    RegionModelViewSet,
    SubRegionModelViewSet,
)


@extend_schema_view(
    list=extend_schema(tags=["Cities"], summary="List all cities"),
    retrieve=extend_schema(tags=["Cities"], summary="Retrieve a city"),
)
class CustomCityModelViewSet(CityModelViewSet):
    pass


@extend_schema_view(
    list=extend_schema(tags=["Countries"], summary="List all countries"),
    retrieve=extend_schema(tags=["Countries"], summary="Retrieve a country"),
)
class CustomCountryModelViewSet(CountryModelViewSet):
    pass


@extend_schema_view(
    list=extend_schema(tags=["Regions"], summary="List all regions"),
    retrieve=extend_schema(tags=["Regions"], summary="Retrieve a region"),
)
class CustomRegionModelViewSet(RegionModelViewSet):
    pass


@extend_schema_view(
    list=extend_schema(tags=["SubRegions"], summary="List all subregions"),
    retrieve=extend_schema(tags=["SubRegions"], summary="Retrieve a subregion"),
)
class CustomSubRegionModelViewSet(SubRegionModelViewSet):
    pass
