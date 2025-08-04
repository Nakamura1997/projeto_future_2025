from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets, generics
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from recomendacoes.models import Recomendacao
from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.utils import timezone
from rest_framework import generics
from .serializers import FormularioRespondidoListSerializer
from .models import FormularioRespondido

from .serializers import (
    FormularioRecenteListSerializer,
    FormularioRespondidoSerializer,
    FormularioSerializer,
    CategoriaSerializer,
    PerguntaSerializer,
    FormularioCompletoSerializer,
    FormularioRespondidoListSerializer,
)

from .models import Formulario, Categoria, Pergunta, FormularioRespondido, Resposta
from users.models import CustomUser


class FormularioViewSet(viewsets.ModelViewSet):
    queryset = Formulario.objects.all()
    serializer_class = FormularioSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class PerguntaViewSet(viewsets.ModelViewSet):
    queryset = Pergunta.objects.all()
    serializer_class = PerguntaSerializer


class CategoriasByFormularioView(generics.ListAPIView):
    serializer_class = CategoriaSerializer

    def get_queryset(self):
        formulario_id = self.kwargs["formulario_id"]
        return Categoria.objects.filter(formulario_id=formulario_id)


class PerguntasByCategoriaView(generics.ListAPIView):
    serializer_class = PerguntaSerializer

    def get_queryset(self):
        categoria_id = self.kwargs["categoria_id"]
        return Pergunta.objects.filter(categoria_id=categoria_id)


class FormularioCompletoView(APIView):

    def get(self, request, cliente_id=None, form_id=None):
        """Retorna formulário com respostas existentes ou vazio"""
        try:
            if not cliente_id or not form_id:
                return Response(
                    {"error": "IDs do cliente e formulário são obrigatórios"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if request.user.id != int(cliente_id) and not request.user.is_staff:
                return Response(
                    {"error": "Você não tem permissão para acessar este recurso"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            formulario = get_object_or_404(Formulario, id=form_id)
            cliente = get_object_or_404(CustomUser, id=cliente_id)

            # Busca a última versão do formulário respondido
            formulario_respondido = (
                FormularioRespondido.objects.filter(
                    formulario=formulario, cliente=cliente
                )
                .order_by("-versao")
                .first()
            )

            serializer = FormularioCompletoSerializer(
                formulario,
                context={
                    "formulario_respondido": formulario_respondido,
                    "request": request,
                },
            )
            return Response(serializer.data)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, cliente_id=None, form_id=None):
        """
        Salva ou atualiza respostas em lote no FormularioRespondido.
        """
        try:
            if not cliente_id:
                return Response(
                    {"error": "ID do cliente é obrigatório"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if request.user.id != int(cliente_id) and not request.user.is_staff:
                return Response(
                    {"error": "Você não tem permissão para realizar esta ação"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            cliente = get_object_or_404(CustomUser, id=cliente_id)

            formulario = Formulario.objects.filter(id=form_id).first()
            if formulario is None:
                formulario = Formulario.objects.first()
            if formulario is None:
                return Response({"error": "Nenhum formulário cadastrado."}, status=status.HTTP_400_BAD_REQUEST)

            formulario_respondido, created = FormularioRespondido.objects.get_or_create(
                formulario=formulario,
                cliente=cliente,
                versao=1,
                defaults={
                    "responsavel": request.user,
                    "status": "rascunho",
                },
            )

            if not created and formulario_respondido.status not in ["rascunho", "pendente"]:
                return Response(
                    {"error": "Só é possível editar formulários com status 'rascunho' ou 'pendente'."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Aceitar {"respostas": [ ... ]} ou lista direta [ ... ]
            respostas_data = request.data.get("respostas", request.data)
            if not isinstance(respostas_data, list):
                return Response({"error": "O campo 'respostas' deve ser uma lista."}, status=status.HTTP_400_BAD_REQUEST)

            for resposta_data in respostas_data:
                pergunta_id = resposta_data.get("pergunta")
                if not pergunta_id:
                    return Response({"error": "ID da pergunta é obrigatório em cada item de 'respostas'."}, status=status.HTTP_400_BAD_REQUEST)

                pergunta = get_object_or_404(Pergunta, id=pergunta_id)

                Resposta.objects.update_or_create(
                    formulario_respondido=formulario_respondido,
                    pergunta=pergunta,
                    defaults={
                        "usuario": request.user,
                        "politica": resposta_data.get("politica", ""),
                        "pratica": resposta_data.get("pratica", ""),
                        "info_complementar": resposta_data.get("info_complementar", ""),
                        "anexos": resposta_data.get("anexos", None),
                    },
                )

            # Atualiza o campo status se enviado
            status_form = request.data.get("status")
            if status_form and status_form in ["rascunho", "pendente", "analise"]:
                formulario_respondido.status = status_form
                formulario_respondido.save()

            return Response(
                {
                    "success": True,
                    "formulario_respondido_id": formulario_respondido.id,
                    "versao": formulario_respondido.versao,
                    "progresso": float(formulario_respondido.progresso),
                    "status": formulario_respondido.status,
                    "created": created,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# No arquivo views.py, adicione:
class FormulariosEmAndamentoView(generics.ListAPIView):
    serializer_class = FormularioRespondidoListSerializer

    def get_queryset(self):
        cliente_id = self.kwargs["cliente_id"]

        return (
            FormularioRespondido.objects.filter(cliente_id=cliente_id)
            .exclude(status="concluido")
            .order_by("-atualizado_em")
        )


class TodosFormulariosEmAnaliseView(APIView):
    def get(self, request):
        formularios_em_analise = FormularioRespondido.objects.filter(
            status="em_analise"
        ).select_related("cliente", "formulario")

        resultados = {}
        for form_respondido in formularios_em_analise:
            # Busca o analista vinculado a alguma recomendação associada
            recomendacao = (
                Recomendacao.objects.filter(formulario_respondido=form_respondido)
                .select_related("analista")
                .order_by("-criado_em")
                .first()
            )
            nome_analista = (
                recomendacao.analista.nome
                if recomendacao and recomendacao.analista
                else None
            )

            resultados[form_respondido.id] = {
                "id_cliente": form_respondido.cliente.id,
                "nome_cliente": form_respondido.cliente.nome,
                "id_formulario": form_respondido.formulario.id,
                "nome_formulario": form_respondido.formulario.nome,
                "finalizado": form_respondido.finalizado,
                "data_finalizado": (
                    form_respondido.data_finalizado.isoformat()
                    if form_respondido.data_finalizado
                    else None
                ),
                "aprovado": form_respondido.aprovado,
                "data_aprovado": (
                    form_respondido.data_aprovado.isoformat()
                    if form_respondido.data_aprovado
                    else None
                ),
                "nome_analista": nome_analista,
            }

        return Response(resultados)


class FormularioPendenciaView(APIView):

    def post(self, request, form_id):

        formulario = get_object_or_404(FormularioRespondido, id=form_id)

        # Verifica se o usuário tem permissão (analista)
        # if not request.user.is_staff:
        #     return Response(
        #         {"error": "Apenas analistas podem colocar formulários em pendência"},
        #         status=status.HTTP_403_FORBIDDEN
        #     )

        observacoes = request.data.get("observacoes")
        if not observacoes:
            return Response(
                {"error": "O campo 'observacoes' é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Atualiza o status e as observações
        formulario.status = "pendente"
        formulario.observacoes_pendencia = observacoes
        formulario.save()

        return Response(
            {
                "status": "Formulário colocado em pendência com sucesso",
                "formulario_id": formulario.id,
                "novo_status": formulario.status,
            },
            status=status.HTTP_200_OK,
        )


class TodosFormulariosRespondidosView(APIView):
    def get(self, request):
        try:
            # Busca todos os formulários respondidos
            formularios_respondidos = FormularioRespondido.objects.all()

            # Usa o serializer para formatar os dados
            serializer = FormularioRespondidoSerializer(
                formularios_respondidos, many=True
            )

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TodosFormulariosView(ListAPIView):
    serializer_class = FormularioSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["nome"]
    ordering_fields = ["nome"]

    def get_queryset(self):
        queryset = Formulario.objects.all()

        # Busca pelo nome (via ?search=)
        search = self.request.query_params.get("search")

        # Filtrar por finalizado se vier
        finalizado_param = self.request.query_params.get("finalizado")
        if finalizado_param is not None:
            finalizado = finalizado_param.lower() == "true"
            # Filtra FormularioRespondido e pega os IDs dos formulários que têm ao menos um respondido finalizado
            from .models import FormularioRespondido

            formularios_finalizados = (
                FormularioRespondido.objects.filter(finalizado=finalizado)
                .values_list("formulario_id", flat=True)
                .distinct()
            )
            queryset = queryset.filter(id__in=formularios_finalizados)

        # Filtrar por aprovado se vier
        aprovado_param = self.request.query_params.get("aprovado")
        if aprovado_param is not None:
            aprovado = aprovado_param.lower() == "true"
            from .models import FormularioRespondido

            formularios_aprovados = (
                FormularioRespondido.objects.filter(aprovado=aprovado)
                .values_list("formulario_id", flat=True)
                .distinct()
            )
            queryset = queryset.filter(id__in=formularios_aprovados)

        return queryset


class FormularioFinalizarView(APIView):

    def post(self, request, form_id):
        formulario = get_object_or_404(FormularioRespondido, id=form_id)

        # Permissões: pode ajustar conforme sua regra
        if request.user != formulario.responsavel and not request.user.is_staff:
            return Response(
                {"error": "Você não tem permissão para finalizar este formulário."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if formulario.finalizado:
            return Response(
                {"error": "Este formulário já foi finalizado anteriormente."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        formulario.finalizado = True
        formulario.data_finalizado = timezone.now()
        formulario.save()

        return Response(
            {
                "status": "Formulário finalizado com sucesso.",
                "formulario_id": formulario.id,
                "data_finalizado": formulario.data_finalizado,
            },
            status=status.HTTP_200_OK,
        )


class FormularioAprovarView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, form_id):
        formulario = get_object_or_404(FormularioRespondido, id=form_id)

        # Verifica permissão
        if not request.user.is_staff:
            return Response(
                {"error": "Apenas gestores podem aprovar este formulário."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if formulario.aprovado:
            return Response(
                {"error": "Este formulário já foi aprovado anteriormente."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Marcar como aprovado e setar data de aprovação
        formulario.aprovado = True
        formulario.data_aprovado = timezone.now()

        # ALTERAÇÃO: ao aprovar, também mudar status para "concluido"
        formulario.status = "concluido"

        formulario.save()

        return Response(
            {
                "status": "Formulário aprovado e concluído com sucesso.",
                "formulario_id": formulario.id,
                "data_aprovado": formulario.data_aprovado,
                "novo_status": formulario.status,
            },
            status=status.HTTP_200_OK,
        )

    class TodosFormulariosView(ListAPIView):
        queryset = Formulario.objects.all()
        serializer_class = FormularioSerializer
        filter_backends = [
            DjangoFilterBackend,
            filters.SearchFilter,
            filters.OrderingFilter,
        ]
        filterset_fields = [
            "status",
            "cliente",
            "responsavel",
        ]  # ajuste conforme seus campos
        search_fields = ["nome", "descricao"]  # ajuste conforme seus campos
        ordering_fields = [
            "criado_em",
            "atualizado_em",
            "nome",
        ]  # ajuste conforme seus campos


class TodosFormulariosConcluidosView(APIView):
    def get(self, request):
        formularios_concluidos = FormularioRespondido.objects.filter(
            status="concluido"
        ).select_related("cliente", "formulario")

        resultados = {}
        for form_respondido in formularios_concluidos:
            # Busca o analista vinculado a alguma recomendação associada
            recomendacao = (
                Recomendacao.objects.filter(formulario_respondido=form_respondido)
                .select_related("analista")
                .order_by("-criado_em")
                .first()
            )
            nome_analista = (
                recomendacao.analista.nome
                if recomendacao and recomendacao.analista
                else None
            )

            resultados[form_respondido.id] = {
                "id_cliente": form_respondido.cliente.id,
                "nome_cliente": form_respondido.cliente.nome,
                "id_formulario": form_respondido.formulario.id,
                "nome_formulario": form_respondido.formulario.nome,
                "finalizado": form_respondido.finalizado,
                "data_finalizado": (
                    form_respondido.data_finalizado.isoformat()
                    if form_respondido.data_finalizado
                    else None
                ),
                "aprovado": form_respondido.aprovado,
                "data_aprovado": (
                    form_respondido.data_aprovado.isoformat()
                    if form_respondido.data_aprovado
                    else None
                ),
                "nome_analista": nome_analista,
                "status": form_respondido.status,
            }

        return Response(resultados, status=status.HTTP_200_OK)


class FormulariosRecentesView(APIView):
    """
    Retorna os formulários dos últimos 7 dias ou os últimos 5 de cada status.
    """

    def get(self, request):
        sete_dias_atras = timezone.now() - timedelta(days=7)

        rascunhos = (
            FormularioRespondido.objects.filter(
                status="rascunho", atualizado_em__gte=sete_dias_atras
            )
            .select_related("cliente", "formulario")
            .order_by("-atualizado_em")[:5]
        )

        em_analise = (
            FormularioRespondido.objects.filter(
                status="em_analise", atualizado_em__gte=sete_dias_atras
            )
            .select_related("cliente", "formulario")
            .order_by("-atualizado_em")[:5]
        )

        concluidos = (
            FormularioRespondido.objects.filter(
                status="concluido", atualizado_em__gte=sete_dias_atras
            )
            .select_related("cliente", "formulario")
            .order_by("-atualizado_em")[:5]
        )

        data = {
            "rascunhos": FormularioRecenteListSerializer(rascunhos, many=True).data,
            "em_analise": FormularioRecenteListSerializer(em_analise, many=True).data,
            "concluidos": FormularioRecenteListSerializer(concluidos, many=True).data,
        }

        return Response(data)


class FormulariosPorClienteView(generics.ListAPIView):
    """
    Retorna todos os formulários (independentemente do status) de um cliente.
    """

    serializer_class = FormularioRespondidoListSerializer

    def get_queryset(self):
        cliente_id = self.kwargs["cliente_id"]
        return FormularioRespondido.objects.filter(cliente_id=cliente_id).order_by(
            "-atualizado_em"
        )
