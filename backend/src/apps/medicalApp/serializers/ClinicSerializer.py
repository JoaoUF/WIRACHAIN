from rest_framework import serializers
from cities_light.models import Country, Region, City
from phonenumber_field.serializerfields import PhoneNumberField
from ..models import Clinic


class RelatedIdDisplayField(serializers.PrimaryKeyRelatedField):
    """
    Accepts a PK on input (like PrimaryKeyRelatedField), but on output returns
    a dict with id and display_name:
      {"id": <pk>, "display_name": "<human name>"}

    This keeps the write contract simple (send id) while returning richer read data.
    """

    def to_representation(self, value):
        if value is None:
            return None
        # Use `.name` if present, otherwise str(value)
        # display = getattr(value, "display_name", None) or getattr(value, "code2", None)
        display = getattr(value, "name", None)
        pk = value.pk
        # Cast to str for UUIDs for consistent JSON
        try:
            # if pk is uuid, convert to str; ints remain ints
            import uuid as _uuid

            if isinstance(pk, _uuid.UUID):
                pk = str(pk)
        except Exception:
            pass
        return {"id": pk, "name": display}


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
