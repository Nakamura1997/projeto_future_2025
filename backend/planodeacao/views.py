import logging
from rest_framework import generics, status
from rest_framework.response import Response
from .models import PlanoDeAcao, PlanoDeAcaoRecomendacao
from .serializers import PlanoDeAcaoSerializer
from django.utils import timezone
from rest_framework.views import APIView

# Configura o logger
logger = logging.getLogger("security")


class PlanoDeAcaoListCreateView(generics.ListCreateAPIView):
    serializer_class = PlanoDeAcaoSerializer

    def get_queryset(self):
        formulario_id = self.request.query_params.get("formularioRespondidoId")
        queryset = PlanoDeAcao.objects
        if formulario_id:
            queryset = queryset.filter(formularioRespondidoId=formulario_id)
        return queryset

    def post(self, request, *args, **kwargs):
        user = request.user
        dados = request.data.copy()
        formulario_id = dados.get("formularioRespondidoId")

        if user.role in ["funcionario", "gestor"]:
            plano_existente = PlanoDeAcao.objects.filter(
                criado_por=user,
                formularioRespondidoId=formulario_id
            ).first()

            if plano_existente:
                serializer = self.get_serializer(plano_existente, data=dados, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=dados)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AtualizarKanbanView(APIView):
    def post(self, request):
        dados = request.data.get("dados", [])
        for item in dados:
            try:
                relacao = PlanoDeAcaoRecomendacao.objects.get(
                    plano_id=item["plano_id"], recomendacao_id=item["recomendacao_id"]
                )
                relacao.status = item["status"]
                relacao.ordem = item["ordem"]
                relacao.data_alteracao = timezone.now()
                relacao.save()
            except PlanoDeAcaoRecomendacao.DoesNotExist:
                continue
        return Response(
            {"detail": "Kanban atualizado com sucesso!"}, status=status.HTTP_200_OK
        )


def get_client_ip(request):
    """Captura o IP real do usuário, mesmo atrás de proxy."""
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip
