from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from .models import Carga

@receiver(post_migrate)
def create_groups(sender, **kwargs):
    # Crear grupo Admin
    admin_group, created = Group.objects.get_or_create(name='Admin')
    
    # Crear grupo Camioneros
    camioneros_group, created = Group.objects.get_or_create(name='Camioneros')
    
    # Obtener el content type del modelo Carga
    content_type = ContentType.objects.get_for_model(Carga)
    
    # Obtener todos los permisos para el modelo Carga
    carga_permissions = Permission.objects.filter(content_type=content_type)
    
    # Obtener específicamente el permiso de visualización
    view_permission = Permission.objects.get(
        content_type=content_type,
        codename='view_carga'
    )
    
    # Asignar todos los permisos al grupo Admin
    admin_group.permissions.set(carga_permissions)
    
    # Asignar solo el permiso de visualización al grupo Camioneros
    camioneros_group.permissions.set([view_permission]) 