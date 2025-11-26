from rest_framework import serializers
from cities_light.models import Country, Region, City
from phonenumber_field.serializerfields import PhoneNumberField
from ..models import Clinic


class ClinicSerializer(serializers.ModelSerializer):
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all(), allow_null=True, required=False)
    region = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all(), allow_null=True, required=False)
    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all(), allow_null=True, required=False)
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
