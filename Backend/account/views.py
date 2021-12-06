from rest_framework.viewsets import ModelViewSet
from .serializers import UserSerializer

from .models import User

class UserView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
