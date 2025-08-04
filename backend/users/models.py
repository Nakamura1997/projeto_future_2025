from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.db import models
from django.utils.translation import gettext_lazy as _
from cadastro.models import Usuario  # Importação adicionada


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O campo 'email' é obrigatório")

        email = self.normalize_email(email)

        # Gera username automaticamente se não fornecido
        if "username" not in extra_fields:
            extra_fields["username"] = self.generate_unique_username(email)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        # Cria registro correspondente em Usuario
        self.sync_with_usuario(user)

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("role", "gestor")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superusuário precisa ter is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superusuário precisa ter is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

    def generate_unique_username(self, email):
        """Gera um username único baseado no email"""
        base_username = email.split("@")[0]
        username = base_username
        counter = 1

        while self.model.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        return username

    def sync_with_usuario(self, custom_user):
        """Sincroniza com o modelo Usuario"""
        Usuario.objects.update_or_create(
            email=custom_user.email,
            defaults={
                "first_name": custom_user.nome.split()[0] if custom_user.nome else "",
                "last_name": (
                    " ".join(custom_user.nome.split()[1:]) if custom_user.nome else ""
                ),
                "tipo_usuario": self.get_tipo_usuario(custom_user.role),
                "is_active": custom_user.is_active,
                "password": custom_user.password,
                "permissoes": self.get_permissoes(custom_user.role),
            },
        )

    def get_tipo_usuario(self, role):
        """Mapeia roles para tipos de usuário"""
        role_map = {
            "cliente": "Cliente",
            "subcliente": "Cliente",
            "funcionario": "Analista",
            "gestor": "Gestor",
        }
        return role_map.get(role, "Cliente")

    def get_permissoes(self, role):
        """Define permissões padrão por role"""
        if role == "gestor":
            return ["criar_analistas", "aprovar_relatorios"]
        return []


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ("cliente", "Cliente"),
        ("subcliente", "Subcliente"),
        ("funcionario", "Funcionário"),
        ("gestor", "Gestor"),
    ]

    # Campos personalizados
    username = models.CharField(
        max_length=150,
        unique=True,
        blank=True,  # Permite blank para geração automática
        help_text="Obrigatório. 150 caracteres ou menos. Letras, números e @/./+/-/_ apenas.",
    )
    nome = models.CharField(max_length=255, verbose_name="Nome Completo")
    email = models.EmailField(
        _("email address"),
        unique=True,
        error_messages={
            "unique": "Já existe um usuário com este email.",
        },
    )
    role = models.CharField(
        max_length=50,
        choices=ROLE_CHOICES,
        default="cliente",
        verbose_name="Tipo de Usuário",
    )

    # Definições para o Django
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nome"]  # Removido username dos required fields

    # Relacionamentos
    groups = models.ManyToManyField(
        Group,
        related_name="customuser_groups",
        blank=True,
        verbose_name="Grupos",
        help_text="Grupos aos quais este usuário pertence.",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_permissions",
        blank=True,
        verbose_name="Permissões do usuário",
        help_text="Permissões específicas para este usuário.",
    )

    cliente = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subclientes",
        limit_choices_to={"role": "cliente"},
        verbose_name="Cliente Associado",
    )

    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        """Garante username único antes de salvar"""
        if not self.username:
            self.username = CustomUser.objects.generate_unique_username(self.email)
        super().save(*args, **kwargs)

        # Sincroniza com modelo Usuario
        CustomUser.objects.sync_with_usuario(self)

    def __str__(self):
        return f"{self.nome} ({self.email})"

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
        ordering = ["nome"]
        permissions = [
            ("view_user", "Pode ver usuários"),
            ("change_user", "Pode alterar usuários"),
            ("delete_user", "Pode excluir usuários"),
            ("view_report", "Pode ver relatórios de segurança"),
            ("create_report", "Pode criar relatórios de segurança"),
            ("delete_report", "Pode excluir relatórios de segurança"),
        ]


class Report(models.Model):
    title = models.CharField(max_length=100, verbose_name="Título")
    content = models.TextField(verbose_name="Conteúdo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")
    created_by = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="reports",
        verbose_name="Criado por",
    )

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Relatório"
        verbose_name_plural = "Relatórios"
        ordering = ["-created_at"]
 