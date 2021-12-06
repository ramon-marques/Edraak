from django.db.models import fields
from rest_framework import serializers
from .models import Program, ProgramCategory
from application.serializers import ProgramApplicationSerializer


class ProgramSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Program
        fields = ['id', 'name_en', 'about_en', 'cover_image', 'square_image']


class ProgramSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ['id', 'name_en']


class ProgramCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramCategory
        fields = '__all__'