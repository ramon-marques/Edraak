from program.models import Program
from django.contrib import admin
from .models import Program, ProgramCategory

admin.site.register(Program)
admin.site.register(ProgramCategory)
