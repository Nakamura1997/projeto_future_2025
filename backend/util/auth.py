from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth import get_user_model


class AllowInactiveUserJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        """
        Retorna o usuário associado ao token, sem checar se is_active.
        """
        try:
            user_id = validated_token[api_settings.USER_ID_CLAIM]
        except KeyError:
            self.fail("invalid_token")

        # Correção:
        user_model = get_user_model()
        user_id_field = api_settings.USER_ID_FIELD

        user = user_model.objects.filter(**{user_id_field: user_id}).first()

        if user is None:
            self.fail("user_not_found")

        # NÃO checa user.is_active aqui
        return user
