from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

from util.auth import AllowInactiveUserJWTAuthentication
from util.email_utils import enviar_email_boas_vindas
from .models import Usuario, LogCadastro
from .serializers import (
    UsuarioSerializer,
    CadastroUsuarioSerializer,
    LogCadastroSerializer,
)

User = get_user_model()


@api_view(["POST"])
@permission_classes([AllowAny])
def reenviar_email_token(request):
    email = request.data.get("email")
    site_url = request.data.get("site_url")

    if not email:
        return Response({"detail": "Email é obrigatório."}, status=400)

    usuario = Usuario.objects.filter(email=email).first()
    if not usuario:
        return Response({"detail": "Usuário não encontrado."}, status=404)

    refresh = RefreshToken.for_user(usuario)
    token = str(refresh.access_token)
    nome_usuario = usuario.first_name or ""

    enviar_email_boas_vindas(email, token, site_url, nome_usuario=nome_usuario)

    return Response({"detail": "E-mail reenviado com sucesso."}, status=200)


@api_view(["POST"])
@permission_classes([AllowAny])
def resetar_senha_por_email(request):
    email = request.data.get("email")
    site_url = request.data.get("site_url")

    if not email or not site_url:
        return Response(
            {"detail": "E-mail e site_url são obrigatórios."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.filter(email=email).first()
    if not user:
        return Response(
            {"detail": "Usuário não encontrado com esse e-mail."},
            status=status.HTTP_404_NOT_FOUND,
        )

    refresh = RefreshToken.for_user(user)
    token = str(refresh.access_token)

    nome_usuario = ""
    try:
        usuario_obj = Usuario.objects.get(email=email)
        nome_usuario = usuario_obj.first_name or ""
    except Usuario.DoesNotExist:
        pass

    enviar_email_boas_vindas(email, token, site_url, nome_usuario=nome_usuario)

    return Response(
        {"detail": "E-mail de redefinição de senha enviado com sucesso."},
        status=status.HTTP_200_OK,
    )


class DefinirSenhaView(APIView):
    authentication_classes = [AllowInactiveUserJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        senha = request.data.get("senha")
        if not senha:
            return Response({"detail": "Senha é obrigatória."}, status=400)

        user = request.user
        user.set_password(senha)
        user.is_active = True
        user.save()

        usuario = Usuario.objects.filter(email=user.email).first()
        if usuario:
            usuario.is_active = True
            usuario.save()

        return Response(
            {"detail": "Senha definida com sucesso. Conta ativada."}, status=200
        )


class UsuarioPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class LogCadastroViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LogCadastro.objects.all().order_by("-data_acao")
    serializer_class = LogCadastroSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["usuario", "acao"]
    ordering_fields = ["data_acao"]


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by("-data_criacao")
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["tipo_usuario", "is_active"]
    search_fields = ["first_name", "last_name", "email", "empresa"]
    ordering_fields = ["data_criacao", "first_name", "last_name", "email"]
    pagination_class = UsuarioPagination

    def get_serializer_class(self):
        if self.action == "create":
            return CadastroUsuarioSerializer
        return UsuarioSerializer

    def check_permissions(self, request):
        super().check_permissions(request)
        if request.user.is_superuser:
            return

        if self.action == "create":
            tipo_novo_usuario = request.data.get("tipo_usuario", "")
            if tipo_novo_usuario == "Gestor":
                self.permission_denied(
                    request,
                    message="Apenas superusuários podem criar novos gestores.",
                    code=403,
                )

    def create(self, request, *args, **kwargs):
        try:
            tipo_novo_usuario = request.data.get("tipo_usuario", "")
            permissoes_novo_usuario = request.data.get("permissoes", [])

            if not request.user.is_superuser:
                usuario_logado = Usuario.objects.get(email=request.user.email)

                if "criar_analistas" in permissoes_novo_usuario and (
                    not hasattr(usuario_logado, "permissoes")
                    or "criar_analistas" not in usuario_logado.permissoes
                ):
                    return Response(
                        {"detail": "Você não tem permissão para criar analistas."},
                        status=403,
                    )

                if "aprovar_relatorios" in permissoes_novo_usuario and (
                    not hasattr(usuario_logado, "permissoes")
                    or "aprovar_relatorios" not in usuario_logado.permissoes
                ):
                    return Response(
                        {"detail": "Você não tem permissão para aprovar relatórios."},
                        status=403,
                    )

            serializer = self.get_serializer(
                data=request.data, context={"request": request}
            )
            serializer.is_valid(raise_exception=True)
            usuario = serializer.save()
            token = serializer.context.get("token")

            return Response(
                {
                    "usuario": serializer.data,
                    "token": token,
                    "message": "Cadastro criado com sucesso.",
                },
                status=201,
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=400)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if not request.user.is_superuser:
            if instance.tipo_usuario == "Gestor":
                return Response(
                    {"detail": "Apenas superusuários podem editar gestores."},
                    status=403,
                )

            permissoes = request.data.get("permissoes", [])
            if (
                "criar_analistas" in permissoes
                or "aprovar_relatorios" in permissoes
            ):
                return Response(
                    {"detail": "Você não pode conceder essas permissões."},
                    status=403,
                )

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if "email" in request.data or "first_name" in request.data:
            try:
                custom_user = User.objects.get(email=instance.email)
                if "email" in request.data:
                    custom_user.email = request.data["email"]
                if "first_name" in request.data:
                    custom_user.nome = request.data["first_name"]
                custom_user.save()
            except User.DoesNotExist:
                pass

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if not request.user.is_superuser:
            if instance.tipo_usuario == "Gestor":
                return Response(
                    {"detail": "Apenas superusuários podem deletar gestores."},
                    status=403,
                )
            if instance.email == request.user.email:
                return Response(
                    {"detail": "Você não pode deletar seu próprio usuário."},
                    status=403,
                )

        User.objects.filter(email=instance.email).delete()
        self.perform_destroy(instance)
        return Response(status=204)

    @action(detail=True, methods=["post"])
    def ativar(self, request, pk=None):
        usuario = self.get_object()
        usuario.is_active = not usuario.is_active
        usuario.save()

        LogCadastro.objects.create(
            usuario=usuario,
            acao="Status alterado",
            detalhes=f"Usuário {'ativado' if usuario.is_active else 'desativado'}",
        )

        return Response({"status": "success", "is_active": usuario.is_active}, status=200)

    @action(detail=False, methods=["get"])
    def tipos_usuario(self, request):
        tipos = [choice[0] for choice in Usuario.TIPO_USUARIO_CHOICES]
        return Response(tipos, status=200)

    @action(detail=True, methods=["patch"])
    def set_permissions(self, request, pk=None):
        instance = self.get_object()

        if not request.user.is_superuser:
            if instance.tipo_usuario == "Gestor":
                return Response(
                    {
                        "detail": "Apenas superusuários podem modificar permissões de gestores."
                    },
                    status=403,
                )

            if not any(
                perm in getattr(request.user, "permissoes", [])
                for perm in ["criar_analistas", "aprovar_relatorios"]
            ):
                return Response(
                    {"detail": "Você não tem permissão para modificar permissões."},
                    status=403,
                )

        permissoes = request.data.get("permissoes", [])
        if not isinstance(permissoes, list):
            return Response(
                {"detail": "O campo 'permissoes' deve ser uma lista."},
                status=400,
            )

        instance.permissoes = permissoes
        instance.save()

        return Response(
            {"detail": "Permissões atualizadas com sucesso."},
            status=200,
        )
