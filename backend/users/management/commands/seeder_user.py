from django.core.management.base import BaseCommand
from users.models import CustomUser
from cadastro.models import Usuario
from django.contrib.auth.hashers import make_password


class Command(BaseCommand):
    help = "Cria usuários de teste (cliente, subcliente, funcionario, gestor, superusuário) e cadastros vinculados"

    def criar_usuario_cadastro(
        self, custom_user: CustomUser, tipo_usuario: str = "Cliente", empresa: str = ""
    ):
        usuario, created = Usuario.objects.get_or_create(
            email=custom_user.email,
            defaults={
                "first_name": custom_user.nome,
                "last_name": "",
                "tipo_usuario": tipo_usuario,
                "empresa": empresa,
                "nist_maturidade": False,
                "is_active": custom_user.is_active,
                "password": custom_user.password,  # Usa o hash da senha do CustomUser
            },
        )
        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Usuario de cadastro '{usuario.email}' criado com sucesso."
                )
            )
        else:
            self.stdout.write(f"Usuario de cadastro '{usuario.email}' já existe.")

    def handle(self, *args, **kwargs):
        superuser_email = "dev@test.com"
        superuser_password = "dev12345"

        if not CustomUser.objects.filter(email=superuser_email).exists():
            superuser = CustomUser.objects.create_superuser(
                email=superuser_email,
                password=superuser_password,
                username="admin",
                nome="Desenvolvedor Admin",
                role="gestor",
                is_staff=True,
                is_superuser=True,
            )
            self.stdout.write(self.style.SUCCESS("Superusuário criado com sucesso."))
        else:
            superuser = CustomUser.objects.get(email=superuser_email)
            self.stdout.write("Superusuário já existe.")
        self.criar_usuario_cadastro(superuser, tipo_usuario="Gestor")

        clientes = [
            {
                "email": "cliente@example.com",
                "username": "cliente_user",
                "nome": "Cliente Exemplo",
            },
            {
                "email": "cliente2@example.com",
                "username": "cliente2_user",
                "nome": "Cliente2 Exemplo",
            },
            {
                "email": "cliente3@example.com",
                "username": "cliente3_user",
                "nome": "Cliente 3",
            },
            {
                "email": "cliente4@example.com",
                "username": "cliente4_user",
                "nome": "Cliente4 Exemplo",
            },
        ]

        for cliente_info in clientes:
            cliente, created = CustomUser.objects.get_or_create(
                email=cliente_info["email"],
                defaults={
                    "username": cliente_info["username"],
                    "nome": cliente_info["nome"],
                    "role": "cliente",
                    "is_staff": False,
                    "is_superuser": False,
                },
            )
            if created:
                cliente.set_password("123456")
                cliente.save()
                self.stdout.write(
                    self.style.SUCCESS(f"{cliente_info['nome']} criado com sucesso.")
                )
            else:
                self.stdout.write(f"{cliente_info['nome']} já existe.")
            self.criar_usuario_cadastro(cliente, tipo_usuario="Cliente")

        subcliente, created = CustomUser.objects.get_or_create(
            email="subcliente@example.com",
            defaults={
                "username": "subcliente_user",
                "nome": "Subcliente Exemplo",
                "role": "subcliente",
                "cliente": cliente,
                "is_staff": False,
                "is_superuser": False,
            },
        )
        if created:
            subcliente.set_password("123456")
            subcliente.save()
            self.stdout.write(self.style.SUCCESS("Subcliente criado com sucesso."))
        else:
            self.stdout.write("Subcliente já existe.")
        self.criar_usuario_cadastro(subcliente, tipo_usuario="Cliente")

        funcionario, created = CustomUser.objects.get_or_create(
            email="funcionario@example.com",
            defaults={
                "username": "funcionario_user",
                "nome": "Funcionário Exemplo",
                "role": "funcionario",
                "is_staff": True,
                "is_superuser": False,
            },
        )
        if created:
            funcionario.set_password("123456")
            funcionario.save()
            self.stdout.write(self.style.SUCCESS("Funcionário criado com sucesso."))
        else:
            self.stdout.write("Funcionário já existe.")
        self.criar_usuario_cadastro(funcionario, tipo_usuario="Analista")

        gestor, created = CustomUser.objects.get_or_create(
            email="gestor@example.com",
            defaults={
                "username": "gestor_user",
                "nome": "Gestor Exemplo",
                "role": "gestor",
                "is_staff": True,
                "is_superuser": False,
            },
        )
        if created:
            gestor.set_password("123456")
            gestor.save()
            self.stdout.write(self.style.SUCCESS("Gestor criado com sucesso."))
        else:
            self.stdout.write("Gestor já existe.")
        self.criar_usuario_cadastro(gestor, tipo_usuario="Gestor")

        self.stdout.write(
            self.style.SUCCESS(
                "Seeder concluído com sucesso, usuários e cadastros sincronizados."
            )
        )
