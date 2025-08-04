from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    pdf_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Report
        fields = [
            'id', 'tipo', 'status', 'formulario_respondido', 'criado_por',
            'revisado_por', 'data_criacao', 'data_atualizacao',
            'data_aprovacao', 'comentarios', 'pdf_file', 'pdf_url'
        ]
        read_only_fields = [
            'id', 'criado_por', 'revisado_por', 'data_criacao',
            'data_atualizacao', 'data_aprovacao', 'pdf_file', 'pdf_url'
        ]
    
    def get_pdf_url(self, obj):
        if obj.pdf_file:
            return obj.pdf_file.url
        return None