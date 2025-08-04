from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"usuarios", views.UsuarioViewSet, basename="usuario")
router.register(r"logs", views.LogCadastroViewSet, basename="log")

urlpatterns = [
    path("", include(router.urls)),
    path("auth/definir-senha/", views.DefinirSenhaView.as_view(), name="definir-senha"),
    path(
        "auth/reenviar-email-token/",
        views.reenviar_email_token,
        name="reenviar-email-token",
    ),
    path(
        "auth/resetar-senha-por-email/",
        views.resetar_senha_por_email,
        name="resetar-senha-por-email",
    ),
]
