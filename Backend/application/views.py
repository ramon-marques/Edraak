from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from django.conf import settings
from .serializers import ProgramApplicationSerializer
from django.core.mail import send_mail

from .models import ProgramApplication


class ProgramApplicationView(ModelViewSet):
    queryset = ProgramApplication.objects.all()
    serializer_class = ProgramApplicationSerializer

@api_view(['POST'])
def send_candidate_email(request):
    
    candidates = request.data['candidates']
    emailTemplate = request.data['emailTemplate']
    
    for candidate in candidates:
        greetings = f'Hello {candidate["user"]["first_name"]}\n\n'
        body = emailTemplate['message']
        send_mail(
            emailTemplate['title'],
            greetings + body,
            settings.EMAIL_HOST_USER,
            [candidate["user"]["email"]],
            fail_silently=False,
        )
    return Response("OK", status=status.HTTP_200_OK)
