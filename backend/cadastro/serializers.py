from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
import secrets
from django.conf import settings

from util.email_utils import enviar_email_boas_vindas
from .models import Usuario, LogCadastro
from users.models import CustomUser


class LogCadastroSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogCadastro
        fields = "__all__"
        read_only_fields = ["data_acao"]


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "tipo_usuario",
            "empresa",
            "nist_maturidade",
            "is_active",
            "data_criacao",
            "permissoes",
        ]
        read_only_fields = ["is_active", "data_criacao"]

    def validate(self, data):
        request = self.context.get("request")
        if request and request.user.is_superuser:
            return data

        instance = self.instance
        if instance and instance.tipo_usuario == "Gestor":
            raise serializers.ValidationError(
                "Apenas superusuários podem modificar gestores."
            )

        if "permissoes" in data:
            permissoes = data["permissoes"]
            if "aprovar_relatorios" in permissoes or "criar_analistas" in permissoes:
                if not hasattr(request.user, "permissoes") or not any(
                    perm in request.user.permissoes
                    for perm in ["aprovar_relatorios", "criar_analistas"]
                ):
                    raise serializers.ValidationError(
                        "Você não tem permissão para conceder esses privilégios."
                    )
        return data


class CadastroUsuarioSerializer(serializers.ModelSerializer):
    permissoes = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
        help_text="Lista de permissões (ex: ['aprovar_relatorios', 'criar_analistas'])",
    )

    class Meta:
        model = Usuario
        fields = [
            "first_name",
            "last_name",
            "email",
            "tipo_usuario",
            "empresa",
            "nist_maturidade",
            "permissoes",
        ]

    def validate_tipo_usuario(self, value):
        request = self.context.get("request")
        if value == "Gestor" and (not request or not request.user.is_superuser):
            raise serializers.ValidationError(
                "Apenas superusuários podem criar usuários do tipo Gestor."
            )
        return value

    def validate_permissoes(self, value):
        valid_perms = ["editar_relatorios", "aprovar_relatorios", "criar_analistas"]

        for perm in value:
            if perm not in valid_perms:
                raise serializers.ValidationError(
                    f"Permissão inválida: {perm}. Permissões válidas: {valid_perms}"
                )

        request = self.context.get("request")
        if request and not request.user.is_superuser:
            restricted_perms = ["aprovar_relatorios", "criar_analistas"]
            if any(perm in value for perm in restricted_perms):
                raise serializers.ValidationError(
                    "Apenas superusuários podem conceder essas permissões."
                )

        return value

    def validate(self, data):
        if getattr(settings, "DEBUG_PERMISSIONS", False):
            return data

        request = self.context.get("request")
        if request and request.user.is_superuser:
            return data

        permissoes = data.get("permissoes", [])
        tipo = data.get("tipo_usuario")

        if "aprovar_relatorios" in permissoes and tipo != "Gestor":
            raise serializers.ValidationError(
                "Apenas gestores podem aprovar relatórios."
            )

        if "criar_analistas" in permissoes and tipo != "Gestor":
            raise serializers.ValidationError("Apenas gestores podem criar analistas.")

        return data

    def create(self, validated_data):
        permissoes = validated_data.pop("permissoes", [])
        tipo_usuario = validated_data.get("tipo_usuario", "Cliente")

        # DEBUG opcional: descomente se quiser verificar
        # print(">>> tipo_usuario recebido:", tipo_usuario)

        usuario = Usuario.objects.create(
            **validated_data,
            permissoes=permissoes,
            is_active=True,
        )

        senha = secrets.token_urlsafe(12)

        tipo_to_role = {
            "Gestor": "gestor",
            "Analista": "analista",
            "Cliente": "cliente",
        }

        CustomUser.objects.create_user(
            email=usuario.email,
            password=make_password(senha),
            nome=usuario.first_name,
            role=tipo_to_role.get(tipo_usuario, "cliente"),
            is_active=True,
        )

        if "request" in self.context:
            refresh = RefreshToken.for_user(usuario)
            token = str(refresh.access_token)

            enviar_email_boas_vindas(
                usuario.email,
                token,
                self.context["request"].data.get("site_url"),
                nome_usuario=usuario.first_name,
            )
            self.context["token"] = token

        return usuario