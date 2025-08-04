import pytest
from django.urls import reverse
from assessments.models import Question
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def admin_user(django_user_model):
    return django_user_model.objects.create_user(
        email="admin@example.com", username="admin", password="password", is_staff=True
    )


@pytest.fixture
def test_questions():
    return [
        Question.objects.create(text="GV.01", category="GV", weight=1.0),
        Question.objects.create(text="ID.01", category="ID", weight=1.0),
        Question.objects.create(text="PR.01", category="PR", weight=1.5),
    ]


@pytest.mark.django_db
def test_lgpd_assessment_flow(api_client, admin_user, test_questions):
    # 1. Configuração do cliente
    client = api_client
    client.force_authenticate(user=admin_user)

    # 2. Payload no formato EXATO que o serializer espera
    payload = [
        {
            "question": test_questions[0].id,
            "politica": 4,
            "pratica": 3,
        },
        {
            "question": test_questions[1].id,
            "politica": 3,
            "pratica": 2,
        },
        {
            "question": test_questions[2].id,
            "politica": 5,
            "pratica": 4,
        },
    ]

    # 3. Chamada à API
    response = client.post(
        reverse("assessmentresponse-list"), data=payload, format="json"
    )

    # 4. Debug detalhado
    print("\n=== DEBUG ===")
    print("Endpoint:", reverse("assessmentresponse-list"))
    print("Payload enviado:", payload)
    print("Resposta da API:", response.json())
    print("Status code:", response.status_code)

    # 5. Verificações
    response_data = response.json()

    assert response.status_code == 201, f"Erro na API: {response_data}"
    assert len(response_data) == 3

    # Verifica cada item da resposta
    for i, item in enumerate(response_data):
        assert item["question"] == test_questions[i].id
        assert item["politica"] == payload[i]["politica"]
        assert item["pratica"] == payload[i]["pratica"]
        assert item["user"] == admin_user.id  # Verifica se o usuário foi associado

    print("Teste LGPD Assessment Flow concluído com sucesso!")
    print("==========================================")
