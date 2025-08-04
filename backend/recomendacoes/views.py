from decimal import Decimal
from rest_framework import generics, permissions
from .models import Recomendacao
from .serializers import RecomendacaoSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from form.models import FormularioRespondido, Resposta
from .models import Recomendacao
import logging

logger = logging.getLogger(__name__)

mapeamento = {
    "Inicial": Decimal("1.0"),
    "Repetido": Decimal("2.0"),
    "Definido": Decimal("3.0"),
    "Gerenciado": Decimal("4.0"),
    "Otimizado": Decimal("5.0"),
}

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def verificar_recomendacoes_faltantes(request, formulario_id):
    try:
        formulario = FormularioRespondido.objects.get(id=formulario_id)

        respostas = Resposta.objects.filter(formulario_respondido=formulario).exclude(
            pergunta__codigo__in=Recomendacao.objects.filter(
                formulario_respondido=formulario
            ).values_list("perguntaId", flat=True)
        )

        respostas_sem_recomendacao = []
        for resposta in respostas:
            try:
                score_str = resposta.pratica
                if score_str is not None:
                    score = mapeamento.get(score_str)
                    if score is not None and score < Decimal("3.0"):
                        respostas_sem_recomendacao.append(resposta)
                    else:
                        try:
                            score_numeric = Decimal(score_str)
                            if score_numeric < Decimal("3.0"):
                                respostas_sem_recomendacao.append(resposta)
                        except (ValueError, TypeError, Decimal.InvalidOperation) as e:
                            logger.warning(f"Valor de 'pratica' inválido encontrado: '{score_str}' - Erro: {e}")
                            # Decide se você quer fazer algo mais aqui, como registrar em um sistema de monitoramento
            except AttributeError:
                # Lidar com o caso em que resposta.pratica é None
                pass

        # Formata os dados para resposta
        dados = {
            "total_faltantes": len(respostas_sem_recomendacao),
            "perguntas_faltantes": [
                {"id": r.pergunta.id, "texto": r.pergunta.questao, "score": r.pratica}
                for r in respostas_sem_recomendacao
            ],
            "pode_enviar": len(respostas_sem_recomendacao) == 0,
        }

        return Response(dados, status=status.HTTP_200_OK)

    except FormularioRespondido.DoesNotExist:
        return Response(
            {"error": "Formulário não encontrado"}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RecomendacaoListCreateView(generics.ListCreateAPIView):
    serializer_class = RecomendacaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        cliente_id = self.kwargs["cliente_id"]
        formulario_id = self.kwargs["formulario_id"]

        return Recomendacao.objects.filter(
            cliente_id=cliente_id, formulario_respondido_id=formulario_id
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update(
            {
                "cliente_id": self.kwargs["cliente_id"],
                "formulario_id": self.kwargs["formulario_id"],
                "request": self.request,
            }
        )
        return context


class RecomendacaoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RecomendacaoSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Recomendacao.objects.all()

    def perform_update(self, serializer):
        # Garante que o analista não seja alterado
        if "analista" in serializer.validated_data:
            serializer.validated_data.pop("analista")
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()