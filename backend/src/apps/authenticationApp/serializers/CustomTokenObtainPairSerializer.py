from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        print("CUSTOM USER", user)
        token = super().get_token(user)

        token["email"] = user.email
        token["role"] = getattr(user, "role", None)
        token["document_value"] = getattr(user, "document_value", None)
        token["enterprise"] = getattr(user, "enterprise", None)

        return token
