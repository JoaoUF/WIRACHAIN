from rest_framework import serializers
from cities_light.models import Country, Region, City, SubRegion


class CustomCountrySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="pk", read_only=True)

    class Meta:
        model = Country
        fields = [
            "id",
            "name",
            "code2",
            "phone",
        ]


class CustomRegionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="pk", read_only=True)

    class Meta:
        model = Region
        fields = [
            "id",
            "name",
        ]


class CustomSubRegionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="pk", read_only=True)

    class Meta:
        model = SubRegion
        fields = [
            "id",
            "name",
        ]


class CustomCitySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="pk", read_only=True)

    class Meta:
        model = City
        fields = [
            "id",
            "name",
        ]
