from django.contrib import admin
from .models import Carga

# Register your models here.

@admin.register(Carga)
class CargaAdmin(admin.ModelAdmin):
    list_display = ('origen', 'destino', 'km', 'precio', 'forma_pago')