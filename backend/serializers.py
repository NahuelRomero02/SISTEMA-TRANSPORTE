from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Agregar campos personalizados
        token['username'] = user.username
        token['is_admin'] = user.is_staff  # o user.is_superuser según tu lógica
        return token