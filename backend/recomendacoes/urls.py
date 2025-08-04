from django.urls import path
from .views import (
    RecomendacaoListCreateView,
    RecomendacaoRetrieveUpdateDestroyView,
    verificar_recomendacoes_faltantes,
)

urlpatterns = [
    path(
        "recomendacoes/<int:cliente_id>/<int:formulario_id>/",
        RecomendacaoListCreateView.as_view(),
        name="recomendacoes-list-create",
    ),
    path(
        "recomendacoes/<int:pk>/",
        RecomendacaoRetrieveUpdateDestroyView.as_view(),
        name="recomendacao-detail",
    ),
    path(
        "clientes/<int:cliente_id>/formularios/<int:formulario_id>/recomendacoes/",
        RecomendacaoListCreateView.as_view(),
        name="recomendacao-list-create",
    ),
    path(
        "recomendacoes/<int:pk>/",
        RecomendacaoRetrieveUpdateDestroyView.as_view(),
        name="recomendacao-detail",
    ),
    path(
        "formularios/<int:formulario_id>/verificar-recomendacoes/",
        verificar_recomendacoes_faltantes,
        name="verificar-recomendacoes",
    ),
]
