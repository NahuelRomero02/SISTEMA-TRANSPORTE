from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import Group
from .models import Carga
from .serializers import CargaSerializer

class IsAdminOrReadOnly(AllowAny):
    def has_permission(self, request, view):
        # Permitir lectura a todos (incluso sin autenticación)
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        # Permitir escritura solo a administradores
        return request.user.is_authenticated and request.user.groups.filter(name='Admin').exists()

class CargaViewSet(viewsets.ModelViewSet):
    queryset = Carga.objects.all()
    serializer_class = CargaSerializer
    permission_classes = [IsAdminOrReadOnly]
