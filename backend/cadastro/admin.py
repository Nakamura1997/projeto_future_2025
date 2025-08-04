from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, LogCadastro


class UsuarioAdmin(UserAdmin):
    list_display = (
        "email",
        "first_name",
        "last_name",
        "tipo_usuario",
        "empresa",
        "is_active",
    )
    list_filter = ("tipo_usuario", "is_active")
    search_fields = ("email", "first_name", "last_name", "empresa")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Informações Pessoais",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "tipo_usuario",
                    "empresa",
                    "nist_maturidade",
                )
            },
        ),
        (
            "Permissões",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Datas Importantes", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "tipo_usuario",
                    "password1",
                    "password2",
                ),
            },
        ),
    )


admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(LogCadastro)
