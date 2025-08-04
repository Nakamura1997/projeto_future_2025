from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    GenerateDocxOrPdfView,
    GenerateMultipleReportsView,
    GenerateOperationalReport,
    DownloadOperationalPDF,
    GetReportByFormularioId,
    ReportDetailView,
    ReportListView,
    GenerateTemporaryPDF,
    UploadReportFileView,
    GeneratePDFWithPlaywright,
    GenerateDocxFromHTMLView
)

urlpatterns = [
    path("gerar-docx/", GenerateDocxOrPdfView.as_view(), name="generate-docx-pdf"),
    path(
        "operacional/<int:formulario_id>/",
        GenerateOperationalReport.as_view(),
        name="generate-operational",
    ),
    path(
        "download/<int:report_id>/",
        DownloadOperationalPDF.as_view(),
        name="download-operational",
    ),
    path("<int:report_id>/", ReportDetailView.as_view(), name="report-detail"),
    path("", ReportListView.as_view(), name="report-list"),
    path(
        "gerar-relatorios/<int:formulario_id>/",
        GenerateMultipleReportsView.as_view(),
        name="generate-all-reports",
    ),
    path(
        "temp-pdf/<int:formulario_id>/",
        GenerateTemporaryPDF.as_view(),
        name="generate-temp-pdf",
    ),
    path(
        "upload-report/<int:report_id>/",
        UploadReportFileView.as_view(),
        name="upload-report-file",
    ),
    path(
        "temp-pdf/<int:formulario_id>/",
        GenerateTemporaryPDF.as_view(),
        name="generate-temp-pdf",
    ),
    path(
        "upload-report/<int:report_id>/",
        UploadReportFileView.as_view(),
        name="upload-report-file",
    ),
    path(
        "download/<int:report_id>/",
        DownloadOperationalPDF.as_view(),
        name="download-operational",
    ),
    path(
        "report-by-formulario/<int:formulario_id>/",
        GetReportByFormularioId.as_view(),
        name="report-by-formulario",
    ),
    path(
        "gerar-pdf-playwright/<int:formulario_id>/",
        GeneratePDFWithPlaywright.as_view(),
        name="generate-pdf-playwright",
    ),
    path(
        "html-to-docx/",
        GenerateDocxFromHTMLView.as_view(),
        name="html-to-docx",
    ),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
