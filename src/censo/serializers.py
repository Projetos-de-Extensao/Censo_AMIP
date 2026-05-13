from rest_framework import serializers
from censo.models import Morador, Indicadores, Domicilio

class MoradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Morador
        fields = "__all__"

class IndicadoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicadores
        fields = "__all__"

class DomicilioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domicilio
        fields = "__all__"