from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from cadastro.models import Usuario
import logging

logger = logging.getLogger(__name__)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["email"] = serializers.EmailField(required=False)

    def validate(self, attrs):
        email = attrs.get("email")
        username = attrs.get("username")
        password = attrs.get("password")

        if not (email or username):
            raise serializers.ValidationError(
                {"error": "Você deve fornecer 'username' ou 'email'"}
            )
        if not password:
            raise serializers.ValidationError(
                {"password": "O campo password é obrigatório."}
            )

        User = get_user_model()
        user = None

        if email:
            user = User.objects.filter(email=email).first()
        elif username:
            user = User.objects.filter(username=username).first()

        if not user:
            raise serializers.ValidationError(
                {"error": "Usuário não encontrado com as credenciais fornecidas."}
            )

        if not user.check_password(password):
            raise serializers.ValidationError({"password": "Senha incorreta."})

        # Busca o cadastro correspondente
        usuario_entry = Usuario.objects.filter(email=user.email).first()

        if usuario_entry and not usuario_entry.is_active:
            raise serializers.ValidationError(
                {
                    "error": "Usuário inativo. Aguarde aprovação ou entre em contato com o suporte."
                }
            )

        refresh = RefreshToken.for_user(user)

        # Dados do cadastro.Usuario
        cadastro_data = None
        if usuario_entry:
            cadastro_data = {
                "id": usuario_entry.id,
                "first_name": usuario_entry.first_name,
                "last_name": usuario_entry.last_name,
                "email": usuario_entry.email,
                "tipo_usuario": usuario_entry.tipo_usuario,
                "empresa": usuario_entry.empresa,
                "nist_maturidade": usuario_entry.nist_maturidade,
                "permissoes": usuario_entry.permissoes,
                "is_active": usuario_entry.is_active,
                "data_criacao": usuario_entry.data_criacao,
            }

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": getattr(user, "username", ""),
                "email": user.email,
                "first_name": getattr(user, "first_name", ""),
                "last_name": getattr(user, "last_name", ""),
                "role": getattr(user, "role", ""),
                "nome": getattr(user, "nome", user.get_full_name()),
                "is_active": (
                    usuario_entry.is_active if usuario_entry else user.is_active
                ),
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "date_joined": user.date_joined,
                "last_login": user.last_login,
            },
            "cadastro": cadastro_data,
        }
