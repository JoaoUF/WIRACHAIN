from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["email"] = user.email
        token["document_value"] = getattr(user, "document_value", None)

        try:
            group_names = [g.name for g in user.groups.all()]
        except Exception:
            group_names = []
        # token["groups"] = group_names
        token["primary_group"] = group_names[0] if group_names else None

        enterprise = getattr(user, "enterprise", None)
        if enterprise is None:
            token["enterprise_id"] = None
        else:
            token["enterprise_id"] = getattr(enterprise, "pk", str(enterprise))

        return token
