from django.urls import path, include
from . import views
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', views.home, name='home'),
    path('api/token/', obtain_auth_token, name='api_token_auth'),
    ]



