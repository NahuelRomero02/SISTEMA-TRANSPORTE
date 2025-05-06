from django.db import models

# Create your models here.

from django.db import models

class Carga(models.Model):
    origen = models.CharField(max_length=255)
    destino = models.CharField(max_length=255)
    km = models.DecimalField(max_digits=6, decimal_places=2)
    comision = models.DecimalField(max_digits=6, decimal_places=2)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    forma_pago = models.CharField(max_length=100)
    descripcion_carga = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.origen} → {self.destino}"