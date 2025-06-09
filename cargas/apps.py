from django.apps import AppConfig


class CargasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cargas'

    def ready(self):
        import cargas.signals  # Importar los signals
