from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from assessments.report_views import (
    RelatorioExportarView,
    CategoriasMediasView,
)

router = DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"assessments", views.AssessmentViewSet)
router.register(r"reports", views.ReportViewSet)
router.register(r"compliance", views.ComplianceViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path(
        "api/", include("assessments.urls")
    ),  # Certifique-se de que isso está presente
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]
