from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from censo.models import Morador, Indicadores, Domicilio
from censo.serializers import MoradorSerializer, IndicadoresSerializer, DomicilioSerializer

class MoradorViewSet(viewsets.ModelViewSet):
    queryset = Morador.objects.all()
    serializer_class = MoradorSerializer

    @action(detail=False, methods=['get'])
    def moradores(self, request):
        dados = Morador.objects.all()
        serializer = self.get_serializer(dados, many=True)
        return Response(serializer.data)

class IndicadoresViewSet(viewsets.ModelViewSet):
    queryset = Indicadores.objects.all()
    serializer_class = IndicadoresSerializer

    @action(detail=False, methods=['get'])
    def indicadores(self, request):
        dados = Indicadores.objects.all()
        serializer = self.get_serializer(dados, many=True)
        return Response(serializer.data)

class DomicilioViewSet(viewsets.ModelViewSet):
    queryset = Domicilio.objects.all()
    serializer_class = DomicilioSerializer

    @action(detail=False, methods=['get'])
    def domicilio(self, request):
        dados = Domicilio.objects.all()
        serializer = self.get_serializer(dados, many=True)
        return Response(serializer.data)

