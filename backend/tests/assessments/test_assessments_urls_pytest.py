import pytest
from django.urls import reverse, resolve
from assessments.views import QuestionViewSet

@pytest.mark.django_db
def test_question_list_url():
    path = reverse("question-list")
    assert resolve(path).func.cls == QuestionViewSet

@pytest.mark.django_db
def test_question_detail_url():
    path = reverse("question-detail", kwargs={"pk": 1})
    assert resolve(path).func.cls == QuestionViewSet

@pytest.mark.django_db
def test_questions_by_category_url():
    path = reverse("questions-by-category")
    resolved_func = resolve(path).func
    # Para views baseadas em classes, a função resolvida é um wrapper. Precisamos verificar a classe.
    assert resolved_func.cls == QuestionViewSet
    # Opcional: verificar se o método correto é chamado (requer um mock ou uma abordagem mais complexa para testes de unidade de URL)
    # Por enquanto, a verificação da classe é suficiente para o teste de URL.


