from django.urls import path, include
from rest_framework.routers import DefaultRouter
from censo.api import MoradorViewSet, IndicadoresViewSet, DomicilioViewSet

router = DefaultRouter()
router.register(r'moradores', MoradorViewSet, basename='morador')
router.register(r'indicadores', IndicadoresViewSet, basename='indicadores')
router.register(r'domicilios', DomicilioViewSet, basename='domicilio')

urlpatterns = [
    path('', include(router.urls)),
]