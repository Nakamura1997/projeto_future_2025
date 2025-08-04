from django.db import models
from form.models import FormularioRespondido
from users.models import CustomUser


class Report(models.Model):
    TIPO_CHOICES = [
        ("operacional", "Operacional"),
        ("executivo", "Executivo"),
    ]

    STATUS_CHOICES = [
        ("rascunho", "Rascunho"),
        ("preenchimento", "Em Preenchimento"),
        ("pendente", "Pendente Aprovação"),
        ("aprovado", "Aprovado"),
        ("reprovado", "Reprovado"),
    ]

    formulario_respondido = models.ForeignKey(
        FormularioRespondido, on_delete=models.CASCADE, related_name="reports"
    )
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="rascunho")
    criado_por = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, related_name="reports_criados"
    )
    revisado_por = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reports_revisados",
    )
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    data_aprovacao = models.DateTimeField(null=True, blank=True)
    comentarios = models.TextField(blank=True, null=True)
    pdf_file = models.FileField(upload_to="reports/pdfs/", null=True, blank=True)

    class Meta:
        ordering = ["-data_criacao"]
        verbose_name = "Relatório"
        verbose_name_plural = "Relatórios"
        unique_together = ("formulario_respondido", "tipo")

    def __str__(self):
        return f"Relatório {self.get_tipo_display()} - {self.formulario_respondido}"