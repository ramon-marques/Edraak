from rest_framework import serializers
from .models import EmailTemplate
from django.conf import settings


class EmailTemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = EmailTemplate
        fields = '__all__'