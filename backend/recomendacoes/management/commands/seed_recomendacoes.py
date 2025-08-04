import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.shortcuts import get_object_or_404

from form.models import Formulario, FormularioRespondido, Pergunta, Resposta
from recomendacoes.models import Recomendacao
from users.models import CustomUser


class Command(BaseCommand):
    help = "Popula o banco de dados com formulários respondidos de teste e cria recomendações para respostas com nota abaixo de 3."

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write("Iniciando seeding de formulários respondidos...")

        try:
            formulario_nist = Formulario.objects.get(nome="NIST 2.0 de Maturidade")
            self.stdout.write(f"Formulário '{formulario_nist.nome}' encontrado.")
        except Formulario.DoesNotExist:
            raise CommandError(
                "O formulário 'NIST 2.0 de Maturidade' não foi encontrado. Certifique-se de que o seeder de formulário foi executado."
            )

        perguntas = Pergunta.objects.filter(formulario=formulario_nist)
        total_perguntas = perguntas.count()

        if total_perguntas != 106:
            self.stdout.write(
                self.style.WARNING(
                    f"Total de perguntas encontradas: {total_perguntas}. Esperado: 106."
                )
            )
        else:
            self.stdout.write(f"Total de perguntas encontradas: {total_perguntas}")

        emails_teste = [
            "cliente@example.com",
            "cliente2@example.com",
            "cliente3@example.com",
            "cliente4@example.com",
        ]
        clientes = CustomUser.objects.filter(role="cliente", email__in=emails_teste)
        if not clientes.exists():
            raise CommandError("Nenhum usuário com role='cliente' encontrado.")

        responsavel = CustomUser.objects.filter(
            role__in=["gestor", "funcionario", "analista"], is_staff=True
        ).first()
        if not responsavel:
            self.stdout.write(
                self.style.WARNING(
                    "Nenhum usuário staff encontrado para ser o responsável."
                )
            )

        niveis_maturidade = [
            "Inicial",
            "Repetido",
            "Definido",
            "Gerenciado",
            "Otimizado",
        ]
        exemplos_info_complementar = [
            "Implementamos políticas claras para esta área.",
            "Estamos em processo de revisão das práticas atuais.",
            "Temos documentação completa sobre este tópico.",
            "Falta alinhamento entre equipes nesta questão.",
            "Planejamos melhorias para o próximo trimestre.",
            "Já realizamos treinamentos específicos sobre este ponto.",
            "Necessitamos de mais recursos para implementar soluções adequadas.",
            "Este é um ponto forte da nossa organização.",
            "Identificamos vulnerabilidades que estão sendo tratadas.",
            "Contamos com ferramentas especializadas para este aspecto.",
        ]
        statuses = ["em_analise"]
        prioridades = ["baixa", "media", "alta"]
        urgencias = ["1", "2", "3", "4", "5"]
        gravidades = ["1", "2", "3", "4", "5"]
        tecnologias = ["Agnóstico", "Cloud", "Rede", "Endpoint", "Aplicação"]

        CATEGORIA_MAP = {
            "GV": "Governar (GV)",
            "ID": "Identificar (ID)",
            "PR": "Proteger (PR)",
            "DE": "Detectar (DE)",
            "RS": "Responder (RS)",
            "RC": "Recuperar (RC)",
        }

        for i, cliente in enumerate(clientes):
            current_status = statuses[i % len(statuses)]
            self.stdout.write(
                f"\nCriando formulário respondido para o cliente: {cliente.email} com status '{current_status}'"
            )

            formulario_respondido, created = (
                FormularioRespondido.objects.update_or_create(
                    cliente=cliente,
                    formulario=formulario_nist,
                    versao=1,
                    defaults={
                        "status": current_status,
                        "responsavel": responsavel,
                        "observacoes_pendencia": (
                            "Observações de pendência de teste."
                            if current_status == "pendente"
                            else ""
                        ),
                        "progresso": 0.00,
                    },
                )
            )

            if created:
                self.stdout.write(
                    f" - FormularioRespondido ID {formulario_respondido.id} criado."
                )
            else:
                self.stdout.write(
                    f" - FormularioRespondido ID {formulario_respondido.id} atualizado."
                )
                formulario_respondido.respostas.all().delete()
                self.stdout.write("   - Respostas antigas removidas.")

            respostas_criadas = 0
            for pergunta in perguntas:
                politica = random.choice(niveis_maturidade)
                pratica = random.choice(niveis_maturidade)
                info = random.choice(exemplos_info_complementar)

                resposta = Resposta.objects.create(
                    formulario_respondido=formulario_respondido,
                    pergunta=pergunta,
                    usuario=cliente,
                    politica=politica,
                    pratica=pratica,
                    info_complementar=info,
                )
                respostas_criadas += 1

                nota_politica = self._converter_nivel(politica)
                nota_pratica = self._converter_nivel(pratica)

                if nota_politica >= 3 and nota_pratica >= 3:
                    continue  # só cria recomendação se ao menos uma nota < 3

                categoria_nome = pergunta.categoria.nome
                categoria_abrev = categoria_nome.split("(")[1].replace(")", "")
                categoria_completa = CATEGORIA_MAP.get(categoria_abrev, "Governar (GV)")
                nist_code = pergunta.codigo.split("-")[0]

                for aplicabilidade in ["Política", "Prática"]:
                    if Recomendacao.objects.filter(
                        cliente=cliente,
                        formulario_respondido=formulario_respondido,
                        perguntaId=pergunta.codigo,
                        aplicabilidade=aplicabilidade,
                    ).exists():
                        continue  # já existe, não cria

                    data_inicio = date.today() + timedelta(days=random.randint(15, 60))
                    meses = random.randint(1, 6)
                    data_fim = data_inicio + timedelta(days=meses * 30)

                    Recomendacao.objects.create(
                        cliente=cliente,
                        formulario_respondido=formulario_respondido,
                        analista=responsavel,
                        nome=f"Recomendação ({aplicabilidade}) para {pergunta.codigo}",
                        categoria=categoria_completa,
                        tecnologia=random.choice(tecnologias),
                        nist=nist_code,
                        prioridade=random.choice(prioridades),
                        responsavel=random.choice([cliente.email, "TI", "Segurança"]),
                        data_inicio=data_inicio,
                        data_fim=data_fim,
                        meses=meses,
                        detalhes=f"Implementar melhorias ({aplicabilidade}) para a prática '{pratica}' na pergunta '{pergunta.questao}'.",
                        investimentos=str(random.randint(100, 5000)),
                        riscos="Risco de não conformidade e vulnerabilidades.",
                        justificativa="Melhorar o nível de maturidade e segurança.",
                        observacoes="Considerar os prazos definidos.",
                        urgencia=random.choice(urgencias),
                        gravidade=random.choice(gravidades),
                        perguntaId=pergunta.codigo,
                        aplicabilidade=aplicabilidade,
                    )

                    self.stdout.write(
                        self.style.SUCCESS(
                            f" - Recomendação ({aplicabilidade}) criada para {cliente.email}, pergunta {pergunta.codigo}"
                        )
                    )

            self.stdout.write(
                f" - Total de {respostas_criadas} respostas criadas para o FormularioRespondido ID {formulario_respondido.id}."
            )

            formulario_respondido.progresso = 100.0
            formulario_respondido.save()
            self.stdout.write(
                f" - Progresso atualizado para {formulario_respondido.progresso:.2f}%."
            )

        self.stdout.write(
            self.style.SUCCESS(
                "\nSeeding concluído com sucesso! Formulários e recomendações abaixo de 3 foram criados."
            )
        )

    def _converter_nivel(self, texto):
        mapa = {
            "Inicial": 1,
            "Repetido": 2,
            "Definido": 3,
            "Gerenciado": 4,
            "Otimizado": 5,
        }
        return mapa.get(texto, 0)
