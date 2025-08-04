import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from assessments.models import Question, AssessmentResponse
from assessments.serializers import AssessmentResponseSerializer

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_user():
    return User.objects.create_user(
        username="testuser", email="test@example.com", password="password123"
    )


@pytest.fixture
def create_question():
    return Question.objects.create(text="Test Question", category="GV", weight=1.0)


@pytest.mark.django_db
def test_assessment_response_serializer_valid_data(create_user, create_question):
    user = create_user
    question = create_question
    data = {"question": question.id, "politica": 3, "pratica": 4}

    # Passa o usuário no contexto
    serializer = AssessmentResponseSerializer(data=data, context={"user": user})

    assert serializer.is_valid(raise_exception=True)

    # O usuário deve ser injetado automaticamente no serializer.create()
    instance = serializer.save()

    # Verifica se os dados foram salvos corretamente
    assert instance.user == user
    assert instance.question == question
    assert instance.politica == 3
    assert instance.pratica == 4


@pytest.mark.django_db
def test_assessment_response_serializer_missing_required_fields(
    create_user, create_question
):
    user = create_user
    question = create_question
    data = {
        "question": question.id,
        "politica": 3,
        # 'pratica' está faltando
    }
    serializer = AssessmentResponseSerializer(data=data, context={"user": user})
    assert not serializer.is_valid()
    assert "pratica" in serializer.errors


@pytest.mark.django_db
def test_assessment_response_serializer_invalid_politica_value(
    create_user, create_question
):
    user = create_user
    question = create_question
    data = {"question": question.id, "politica": 6, "pratica": 4}  # Valor inválido
    serializer = AssessmentResponseSerializer(data=data, context={"user": user})
    assert not serializer.is_valid()
    assert "politica" in serializer.errors


@pytest.mark.django_db
def test_assessment_response_serializer_invalid_pratica_value(
    create_user, create_question
):
    user = create_user
    question = create_question
    data = {"question": question.id, "politica": 3, "pratica": 0}  # Valor inválido
    serializer = AssessmentResponseSerializer(data=data, context={"user": user})
    assert not serializer.is_valid()
    assert "pratica" in serializer.errors


@pytest.mark.django_db
def test_assessment_response_serializer_read_only_fields(create_user, create_question):
    user = create_user
    question = create_question

    # Cria uma instância inicial
    assessment_response = AssessmentResponse.objects.create(
        user=user, question=question, politica=1, pratica=2
    )

    # Testa os campos read-only na serialização
    serializer = AssessmentResponseSerializer(instance=assessment_response)
    data = serializer.data

    assert data["user"] == user.id
    assert "created_at" in data

    # Testa tentativa de atualização de campos read-only
    update_data = {"user": user.id + 1, "created_at": "2025-01-01T00:00:00Z"}
    serializer = AssessmentResponseSerializer(
        instance=assessment_response, data=update_data, partial=True
    )

    assert serializer.is_valid()
    instance = serializer.save()

    # Verifica que os campos read-only não foram alterados
    assert instance.user == user
    assert instance.created_at == assessment_response.created_at
