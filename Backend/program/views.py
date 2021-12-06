from rest_framework.viewsets import ModelViewSet
from .serializers import ProgramSerializer, ProgramCategorySerializer
from emailtemplates.models import EmailTemplate
from emailtemplates.serializers import EmailTemplateSerializer
from application.models import ProgramApplication, Activity
from application.serializers import ProgramApplicationSerializer, ActivitySerializer
from rest_framework.decorators import api_view, permission_classes

from rest_framework.response import Response
from rest_framework import status


from .models import Program, ProgramCategory

class ProgramsView(ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer


@api_view(['GET'])
def applications_by_program(request, pk):
    try:
        
        applications = ProgramApplication.objects.filter(program_id=pk)
        applications_serializer = ProgramApplicationSerializer(applications, many=True)
        return Response(applications_serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def activities_by_program(request, pk):
    try:
        
        activities = Activity.objects.filter(program_id=pk)
        activities_serializer = ActivitySerializer(activities, many=True)
        return Response(activities_serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def templates_by_program(request, pk):
    try:
        
        templates = EmailTemplate.objects.filter(program_id=pk)
        email_template_serializer = EmailTemplateSerializer(templates, many=True)
        return Response(email_template_serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def categories(request):
    categories = ProgramCategory.objects.all()
    serializer = ProgramCategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def save_template(request):

    program = Program.objects.get(pk=1)

    template_data = request.data
    new_template = EmailTemplate.objects.create(title=template_data["title"], message=template_data["message"], program=program)

    new_template.save()

    serializer = EmailTemplateSerializer(new_template)
    return Response(serializer.data, status=status.HTTP_200_OK)
