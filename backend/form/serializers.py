from decimal import Decimal
from rest_framework import serializers
from .models import Formulario, Categoria, FormularioRespondido, Pergunta, Resposta


class PerguntaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pergunta
        fields = "__all__"


class CategoriaSerializer(serializers.ModelSerializer):
    perguntas = PerguntaSerializer(
        many=True, read_only=True
    )  # Retorna detalhes das perguntas

    class Meta:
        model = Categoria
        fields = "__all__"


class FormularioSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()

    class Meta:
        model = Formulario
        fields = ["id", "nome", "total"]

    def get_total(self, obj):
        # Retorna o total de perguntas diretamente relacionadas ao formulário
        return Pergunta.objects.filter(formulario=obj).count()


class RespostaSerializer(serializers.ModelSerializer):
    score = serializers.SerializerMethodField()

    class Meta:
        model = Resposta
        fields = [
            "pergunta",
            "politica",
            "pratica",
            "score",
            "info_complementar",
            "anexos",
        ]

    def get_score(self, obj):
        mapeamento = {
            "Inicial": Decimal("1.0"),
            "Repetido": Decimal("2.0"),
            "Definido": Decimal("3.0"),
            "Gerenciado": Decimal("4.0"),
            "Otimizado": Decimal("5.0"),
        }
        return mapeamento.get(obj.pratica, None)


class PerguntaSerializer(serializers.ModelSerializer):
    resposta = serializers.SerializerMethodField()

    class Meta:
        model = Pergunta
        fields = ["id", "questao", "codigo", "resposta"]

    def get_resposta(self, obj):
        formulario_respondido = self.context.get("formulario_respondido")
        if formulario_respondido:
            resposta = Resposta.objects.filter(
                formulario_respondido=formulario_respondido, pergunta=obj
            ).first()
            if resposta:
                return RespostaSerializer(resposta).data
        return None


class CategoriaSerializer(serializers.ModelSerializer):
    perguntas = PerguntaSerializer(many=True)

    class Meta:
        model = Categoria
        fields = ["id", "nome", "perguntas"]


class FormularioCompletoSerializer(serializers.ModelSerializer):
    categorias = CategoriaSerializer(many=True)

    class Meta:
        model = Formulario
        fields = ["id", "nome", "categorias"]


class FormularioRespondidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormularioRespondido
        fields = [
            "id",
            "formulario",
            "formulario_nome",
            "status",
            "atualizado_em",
            "versao",
            "progresso",
            "observacoes_pendencia",
            "finalizado",
            "aprovado",
            "data_finalizado",
            "data_aprovado",
        ]


class FormularioRespondidoListSerializer(serializers.ModelSerializer):
    formulario_nome = serializers.CharField(source="formulario.nome", read_only=True)

    class Meta:
        model = FormularioRespondido
        fields = [
            "id",
            "formulario",
            "formulario_nome",
            "status",
            "atualizado_em",
            "versao",
            "progresso",
            "observacoes_pendencia",
            "finalizado",
            "aprovado",
            "data_finalizado",
            "data_aprovado",
        ]


class FormularioRespondidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormularioRespondido
        fields = "__all__"  # Isso inclui todos os campos do modelo


class FormularioRecenteListSerializer(serializers.ModelSerializer):
    nome_formulario = serializers.CharField(source="formulario.nome", read_only=True)
    nome_cliente = serializers.CharField(source="cliente.nome", read_only=True)

    class Meta:
        model = FormularioRespondido
        fields = [
            "id",
            "formulario",
            "nome_formulario",
            "cliente",
            "nome_cliente",
            "status",
            "atualizado_em",
            "versao",
            "progresso",
            "observacoes_pendencia",
        ]
