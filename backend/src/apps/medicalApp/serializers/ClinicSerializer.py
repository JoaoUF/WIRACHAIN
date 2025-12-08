from rest_framework import serializers
from cities_light.models import Country, Region, City
from phonenumber_field.serializerfields import PhoneNumberField
from .ExtraSerializer import RelatedIdDisplayField
from ..models import Clinic


class ClinicSerializer(serializers.ModelSerializer):
    city = RelatedIdDisplayField(queryset=City.objects.all(), allow_null=True, required=False)
    region = RelatedIdDisplayField(queryset=Region.objects.all(), allow_null=True, required=False)
    country = RelatedIdDisplayField(queryset=Country.objects.all(), allow_null=True, required=False)
    phone = PhoneNumberField()
    enterprise_user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Clinic
        fields = [
            "id",
            "name",
            "email",
            "website_url",
            "phone",
            "address",
            "city",
            "region",
            "country",
            "enterprise_user",
        ]


class ClinicListSerializer(serializers.ModelSerializer):
    region = RelatedIdDisplayField(queryset=Region.objects.all(), allow_null=True, required=False)
    country = RelatedIdDisplayField(queryset=Country.objects.all(), allow_null=True, required=False)
    """
    Lightweight serializer used for list endpoints (table).
    Only include the fields needed by your UI table to minimize payload.
    """

    phone = PhoneNumberField()

    class Meta:
        model = Clinic
        fields = [
            "id",
            "name",
            "email",
            "country",
            "region",
        ]


class ClinicDetailSerializer(ClinicSerializer):
    """
    Full serializer used for retrieve/create/update.
    Inherits fields and behavior from ClinicBaseSerializer.
    """

    class Meta(ClinicSerializer.Meta):
        fields = ClinicSerializer.Meta.fields
