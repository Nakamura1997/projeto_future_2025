from rest_framework import serializers
from .models import (
    ControlAssessment,
    Answer,
    Question,
    RiskAssessment,
    AssessmentResponse,
)


class AssessmentResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentResponse
        fields = ["id", "user", "question", "politica", "pratica", "created_at"]
        read_only_fields = ["user", "created_at"]

    def create(self, validated_data):
        """
        Injeta o user automaticamente.
        Pode receber o usuário de duas formas:
        1. Através do context['request'].user (quando vem de uma view)
        2. Através do context['user'] (quando vem de um teste)
        """
        try:
            # Tenta obter o usuário do request primeiro
            request = self.context.get("request")
            if request and hasattr(request, "user"):
                user = request.user
            else:
                # Se não tiver request, tenta obter diretamente do context
                user = self.context.get("user")

            if not user:
                raise ValueError("Nenhum usuário encontrado no contexto")

            if not user.is_authenticated:
                raise ValueError("Usuário não autenticado")

            validated_data["user"] = user
            return super().create(validated_data)

        except Exception as e:
            raise serializers.ValidationError(f"Erro ao atribuir usuário: {str(e)}")


class RiskAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskAssessment
        fields = "__all__"


class ControlAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlAssessment
        fields = ["id", "title", "status", "score", "category", "date", "question"]
        ref_name = "AssessmentsControlAssessment"


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = "__all__"
