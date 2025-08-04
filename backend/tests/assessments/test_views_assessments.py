import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from assessments.models import Question, AssessmentResponse

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
def create_staff_user():
    return User.objects.create_user(
        username="staffuser",
        email="staff@example.com",
        password="password123",
        is_staff=True,
    )


@pytest.fixture
def create_question():
    return Question.objects.create(text="Test Question", category="GV", weight=1.0)


@pytest.fixture
def create_assessment_response(create_user, create_question):
    user = create_user
    question = create_question
    return AssessmentResponse.objects.create(
        user=user, question=question, politica=1, pratica=2
    )


@pytest.mark.django_db
def test_assessment_response_list(api_client, create_user, create_assessment_response):
    client = api_client
    user = create_user
    client.force_authenticate(user=user)
    url = reverse("assessmentresponse-list")
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["question"] == create_assessment_response.question.id


@pytest.mark.django_db
def test_assessment_response_create_single(api_client, create_user, create_question):
    client = api_client
    user = create_user
    question = create_question
    client.force_authenticate(user=user)
    url = reverse("assessmentresponse-list")
    data = {"question": question.id, "politica": 3, "pratica": 4}
    response = client.post(url, data, format="json")
    assert response.status_code == 201
    assert AssessmentResponse.objects.count() == 1
    assert AssessmentResponse.objects.first().user == user


@pytest.mark.django_db
def test_assessment_response_create_multiple(api_client, create_user):
    client = api_client
    user = create_user
    client.force_authenticate(user=user)
    url = reverse("assessmentresponse-list")
    question1 = Question.objects.create(text="Q1", category="GV", weight=1.0)
    question2 = Question.objects.create(text="Q2", category="ID", weight=1.0)
    data = [
        {"question": question1.id, "politica": 1, "pratica": 2},
        {"question": question2.id, "politica": 3, "pratica": 4},
    ]
    response = client.post(url, data, format="json")
    assert response.status_code == 201
    assert AssessmentResponse.objects.count() == 2


@pytest.mark.django_db
def test_assessment_response_create_duplicate(api_client, create_user, create_question):
    client = api_client
    user = create_user
    question = create_question
    client.force_authenticate(user=user)
    url = reverse("assessmentresponse-list")
    AssessmentResponse.objects.create(
        user=user, question=question, politica=1, pratica=2
    )
    data = [
        {"question": question.id, "politica": 3, "pratica": 4},
    ]
    response = client.post(url, data, format="json")
    assert response.status_code == 400
    assert "Respostas já existem" in response.data["error"]
    assert AssessmentResponse.objects.count() == 1  # Ainda deve haver apenas 1


@pytest.mark.django_db
def test_assessment_response_update(
    api_client, create_user, create_assessment_response
):
    client = api_client
    user = create_user
    client.force_authenticate(user=user)
    assessment_response = create_assessment_response
    url = reverse("assessmentresponse-detail", kwargs={"pk": assessment_response.pk})
    data = {"politica": 5, "pratica": 5}
    response = client.patch(url, data, format="json")
    assert response.status_code == 200
    assessment_response.refresh_from_db()
    assert assessment_response.politica == 5
    assert assessment_response.pratica == 5


@pytest.mark.django_db
def test_assessment_response_delete(
    api_client, create_user, create_assessment_response
):
    client = api_client
    user = create_user
    client.force_authenticate(user=user)
    assessment_response = create_assessment_response
    url = reverse("assessmentresponse-detail", kwargs={"pk": assessment_response.pk})
    response = client.delete(url)
    assert response.status_code == 204
    assert AssessmentResponse.objects.count() == 0


# Testes para QuestionViewSet
@pytest.mark.django_db
def test_question_list(api_client, create_staff_user, create_question):
    client = api_client
    staff_user = create_staff_user
    client.force_authenticate(user=staff_user)
    url = reverse("question-list")
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["text"] == create_question.text


@pytest.mark.django_db
def test_question_detail(api_client, create_staff_user, create_question):
    client = api_client
    staff_user = create_staff_user
    client.force_authenticate(user=staff_user)
    question = create_question
    url = reverse("question-detail", kwargs={"pk": question.pk})
    response = client.get(url)
    assert response.status_code == 200
    assert response.data["text"] == question.text


@pytest.mark.django_db
def test_question_by_category(api_client, create_staff_user):
    client = api_client
    staff_user = create_staff_user
    client.force_authenticate(user=staff_user)
    Question.objects.create(text="Q1 GV", category="GV", weight=1.0)
    Question.objects.create(text="Q2 GV", category="GV", weight=1.0)
    Question.objects.create(text="Q3 ID", category="ID", weight=1.0)
    url = reverse("question-by-category")
    response = client.get(url)
    assert response.status_code == 200
    assert "GV" in response.data
    assert "ID" in response.data
    assert len(response.data["GV"]) == 2
    assert len(response.data["ID"]) == 1


@pytest.mark.django_db
def test_question_create_permission_denied(api_client, create_user):
    client = api_client
    user = create_user
    client.force_authenticate(user=user)
    url = reverse("question-list")
    data = {"text": "New Question", "category": "GV", "weight": 1.0}
    response = client.post(url, data, format="json")
    assert response.status_code == 403  # Forbidden for non-staff users


@pytest.mark.django_db
def test_question_create_allowed(api_client, create_staff_user):
    client = api_client
    staff_user = create_staff_user
    client.force_authenticate(user=staff_user)
    url = reverse("question-list")
    data = {"text": "New Question", "category": "GV", "weight": 1.0}
    response = client.post(url, data, format="json")
    assert response.status_code == 201
    assert Question.objects.count() == 1


@pytest.mark.django_db
def test_executive_report_view(api_client, create_user, create_question):
    client = api_client
    user = create_user
    client.force_authenticate(user=user)
    question = create_question
    AssessmentResponse.objects.create(
        user=user, question=question, politica=3, pratica=4
    )
    url = reverse("executive-report")
    response = client.get(url)
    assert response.status_code == 200
    assert "lgpd_assessment" in response.data
    assert "metrics" in response.data
    assert response.data["metrics"]["questions_answered"] == 1


@pytest.mark.django_db
def test_save_assessment_view_incomplete(api_client, create_user, create_question):
    client = api_client
    user = create_user
    client.force_authenticate(user=user)
    # Apenas uma questão criada, mas nenhuma resposta ainda
    url = reverse("save-assessment")
    response = client.post(url, format="json")
    assert response.status_code == 400
    assert "Faltam responder" in response.data["error"]


@pytest.mark.django_db
def test_save_assessment_view_complete(api_client, create_user):
    client = api_client
    user = create_user
    client.force_authenticate(user=user)
    # Criar 2 questões e 2 respostas para simular avaliação completa
    question1 = Question.objects.create(text="Q1", category="GV", weight=1.0)
    question2 = Question.objects.create(text="Q2", category="ID", weight=1.0)
    AssessmentResponse.objects.create(
        user=user, question=question1, politica=1, pratica=2
    )
    AssessmentResponse.objects.create(
        user=user, question=question2, politica=3, pratica=4
    )
    url = reverse("save-assessment")
    response = client.post(url, format="json")
    assert response.status_code == 200
    assert "Avaliação salva com sucesso" in response.data["message"]
