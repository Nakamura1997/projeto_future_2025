from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class Usuario(AbstractUser):
    TIPO_USUARIO_CHOICES = [
        ("Cliente", "Cliente"),
        ("Analista", "Analista"),
        ("Gestor", "Gestor"),
    ]

    PERMISSOES_CHOICES = [
        ("editar_relatorios", "Editar Relatórios"),
        ("aprovar_relatorios", "Aprovar Relatórios"),
        ("criar_analistas", "Criar Novos Analistas"),
    ]

    tipo_usuario = models.CharField(
        max_length=10, choices=TIPO_USUARIO_CHOICES, default="Cliente"
    )
    empresa = models.CharField(max_length=100, blank=True)
    nist_maturidade = models.BooleanField(default=False)
    email = models.EmailField(_("email address"), unique=True)
    is_active = models.BooleanField(default=False)
    data_criacao = models.DateTimeField(auto_now_add=True)
    permissoes = models.JSONField(default=list, blank=True)

    username = None
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        permissions = [
            ("aprovar_relatorios", "Pode aprovar relatórios"),
            ("criar_analistas", "Pode criar novos analistas"),
        ]

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"


class LogCadastro(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="logs")
    acao = models.CharField(max_length=255)
    data_acao = models.DateTimeField(auto_now_add=True)
    detalhes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.usuario.email} - {self.acao} - {self.data_acao}"
