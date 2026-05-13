from django.contrib import admin
from .models import Morador, Indicadores, Domicilio

admin.site.register(Morador)
admin.site.register(Indicadores)
admin.site.register(Domicilio)
