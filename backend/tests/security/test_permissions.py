import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from assessments.models import Question, AssessmentResponse

User = get_user_model()


@pytest.fixture
def create_admin_user():
    return User.objects.create_superuser(
        username="admin_test", email="admin@example.com", password="adminpass"
    )


@pytest.fixture
def create_regular_user():
    return User.objects.create_user(
        username="user_test", email="user@example.com", password="userpass"
    )


@pytest.mark.django_db
def test_question_creation_permission(create_admin_user, create_regular_user):
    admin_client = APIClient()
    admin_client.force_authenticate(user=create_admin_user)

    regular_client = APIClient()
    regular_client.force_authenticate(user=create_regular_user)

    unauthenticated_client = APIClient()

    question_data = {
        "text": "Qual a política de segurança de dados?",
        "category": "GV",
        "weight": 1.0,
    }

    # Teste: Usuário não autenticado não pode criar questão
    response = unauthenticated_client.post(reverse("question-list"), question_data)
    assert response.status_code == 401  # Unauthorized

    # Teste: Usuário regular não pode criar questão
    response = regular_client.post(reverse("question-list"), question_data)
    assert response.status_code == 403  # Forbidden

    # Teste: Usuário admin pode criar questão
    response = admin_client.post(reverse("question-list"), question_data)
    assert response.status_code == 201  # Created
    assert Question.objects.count() == 1


@pytest.mark.django_db
def test_lgpd_score_access_permission(create_admin_user, create_regular_user):
    admin_client = APIClient()
    admin_client.force_authenticate(user=create_admin_user)

    regular_client = APIClient()
    regular_client.force_authenticate(user=create_regular_user)

    unauthenticated_client = APIClient()

    # Criar questões para o teste de score LGPD
    question_data = [
        {"text": "Questão GV 1", "category": "GV", "weight": 1.0},
        {"text": "Questão ID 1", "category": "ID", "weight": 1.0},
    ]
    for data in question_data:
        Question.objects.create(**data)
    questions = Question.objects.all()

    # Criar respostas para o usuário regular
    AssessmentResponse.objects.create(user=create_regular_user, question=questions[0], politica=3, pratica=4)
    AssessmentResponse.objects.create(user=create_regular_user, question=questions[1], politica=2, pratica=3)

    # Criar respostas para o usuário admin
    AssessmentResponse.objects.create(user=create_admin_user, question=questions[0], politica=5, pratica=5)
    AssessmentResponse.objects.create(user=create_admin_user, question=questions[1], politica=4, pratica=4)

    # Usar a URL completa para evitar problemas de resolução
    url = "/assessments/reports/lgpd_score/"

    # Teste: Usuário não autenticado não pode acessar o score LGPD
    response = unauthenticated_client.get(url)
    assert response.status_code == 401  # Unauthorized

    # Teste: Usuário regular pode acessar o score LGPD
    response = regular_client.get(url)
    print(f"Response content for regular user: {response.content}")
    assert response.status_code == 200  # OK

    # Teste: Usuário admin pode acessar o score LGPD
    response = admin_client.get(url)
    print(f"Response content for admin user: {response.content}")
    assert response.status_code == 200  # OK


