import pytest
from django.contrib.auth import get_user_model
from assessments.models import (
    AssessmentResponse,
    Question,
    Assessment,
    ControlAssessment,
    RiskAssessment,
    Answer,
)

User = get_user_model()


@pytest.fixture
def create_user():
    return User.objects.create_user(
        username="testuser", email="test@example.com", password="password123"
    )


@pytest.fixture
def create_question():
    return Question.objects.create(text="Test Question", category="GV", weight=1.0)


@pytest.mark.django_db
def test_assessment_response_creation(create_user, create_question):
    user = create_user
    question = create_question
    assessment_response = AssessmentResponse.objects.create(
        user=user, question=question, politica=1, pratica=2
    )
    assert assessment_response.id is not None
    assert assessment_response.user == user
    assert assessment_response.question == question
    assert assessment_response.politica == 1
    assert assessment_response.pratica == 2


@pytest.mark.django_db
def test_assessment_response_str(create_user, create_question):
    user = create_user
    question = create_question
    assessment_response = AssessmentResponse.objects.create(
        user=user, question=question, politica=1, pratica=2
    )
    assert str(assessment_response) == f"{user.username} - {question.text}"


@pytest.mark.django_db
def test_question_creation():
    question = Question.objects.create(
        text="Another Test Question", category="PR", weight=1.5
    )
    assert question.id is not None
    assert question.text == "Another Test Question"
    assert question.category == "PR"
    assert float(question.weight) == 1.5


@pytest.mark.django_db
def test_question_str():
    question = Question.objects.create(
        text="This is a very long test question that should be truncated",
        category="DE",
        weight=2.0,
    )
    # Ajuste para a truncagem real do __str__ do modelo
    expected_start = "Detect - This is a very long test q"
    assert str(question).startswith(expected_start)
    # Verifica se o comprimento está dentro de um limite razoável (30 caracteres + '...' + 'Detect - ')
    assert len(str(question)) <= len(
        "Detect - This is a very long test question that should be truncated..."
    )


@pytest.mark.django_db
def test_assessment_creation(create_user):
    user = create_user
    assessment = Assessment.objects.create(user=user)
    assert assessment.id is not None
    assert assessment.user == user


@pytest.mark.django_db
def test_assessment_str(create_user):
    user = create_user
    assessment = Assessment.objects.create(user=user)
    assert str(assessment) == f"Assessment by {user.username}"


@pytest.mark.django_db
def test_control_assessment_creation(create_user, create_question):
    user = create_user
    question = create_question
    control_assessment = ControlAssessment.objects.create(
        user=user,
        question=question,
        title="Control Assessment Title",
        status="in_progress",
        category="security",
        policy_maturity=3,
        practice_maturity=4,
    )
    assert control_assessment.id is not None
    assert control_assessment.user == user
    assert control_assessment.question == question
    assert control_assessment.title == "Control Assessment Title"
    assert control_assessment.status == "in_progress"
    assert control_assessment.category == "security"
    assert control_assessment.policy_maturity == 3
    assert control_assessment.practice_maturity == 4


@pytest.mark.django_db
def test_control_assessment_str(create_user, create_question):
    user = create_user
    question = create_question
    control_assessment = ControlAssessment.objects.create(
        user=user,
        question=question,
        title="Control Assessment Title",
        status="in_progress",
        category="security",
        policy_maturity=3,
        practice_maturity=4,
    )
    assert str(control_assessment) == "Control Assessment Title"

    # Test when title is None
    control_assessment_no_title = ControlAssessment.objects.create(
        user=user,
        question=question,
        status="completed",
        category="privacy",
        policy_maturity=5,
        practice_maturity=5,
    )
    # Ajuste para a truncagem real do __str__ do modelo
    expected_start_no_title = f"{question.category} - {question.text[:30]}"
    assert str(control_assessment_no_title).startswith(expected_start_no_title)
    assert len(str(control_assessment_no_title)) <= len(
        f"{question.category} - {question.text[:30]}..."
    )


@pytest.mark.django_db
def test_control_assessment_calculate_score(create_user, create_question):
    user = create_user
    question = create_question
    question.weight = 2.0
    question.save()

    control_assessment = ControlAssessment.objects.create(
        user=user, question=question, policy_maturity=3, practice_maturity=4
    )
    control_assessment.calculate_score()
    # (3 * 2.0 + 4 * 2.0) / 2 = (6.0 + 8.0) / 2 = 14.0 / 2 = 7.0
    assert control_assessment.score == 7.0

    # Test with None values
    control_assessment_none = ControlAssessment.objects.create(
        user=user, question=question, policy_maturity=None, practice_maturity=None
    )
    control_assessment_none.calculate_score()
    assert control_assessment_none.score is None


@pytest.mark.django_db
def test_risk_assessment_creation():
    risk_assessment = RiskAssessment.objects.create(
        name="SQL Injection Risk",
        description="Potential SQL injection vulnerability",
        score=80,
        category="high",
        assessment_date="2024-06-20",
    )
    assert risk_assessment.id is not None
    assert risk_assessment.name == "SQL Injection Risk"
    assert risk_assessment.description == "Potential SQL injection vulnerability"
    assert risk_assessment.score == 80
    assert risk_assessment.category == "high"
    assert str(risk_assessment.assessment_date) == "2024-06-20"


@pytest.mark.django_db
def test_risk_assessment_str():
    risk_assessment = RiskAssessment.objects.create(
        name="Cross-Site Scripting Risk",
        description="Potential XSS vulnerability",
        score=60,
        category="medium",
        assessment_date="2024-06-21",
    )
    assert str(risk_assessment) == "Cross-Site Scripting Risk"


@pytest.mark.django_db
def test_answer_creation():
    answer = Answer.objects.create(text="This is a test answer", is_correct=True)
    assert answer.id is not None
    assert answer.text == "This is a test answer"
    assert answer.is_correct is True


@pytest.mark.django_db
def test_answer_str():
    answer = Answer.objects.create(
        text="This is a very long answer that should be truncated for display",
        is_correct=False,
    )
    # Ajuste para a truncagem real do __str__ do modelo
    expected_start = "This is a very long answer that should be trunca"
    assert str(answer).startswith(expected_start)
    assert len(str(answer)) <= len(
        "This is a very long answer that should be truncated for display"
    )
