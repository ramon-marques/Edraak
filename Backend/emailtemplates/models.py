from django.db import models

from program.models import Program

class EmailTemplate(models.Model):
    title   = models.CharField(max_length=255)
    message = models.TextField(null=True, blank=True)
    program = models.ForeignKey(Program, related_name='templates', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True, db_index=True)
    updated = models.DateTimeField(auto_now=True)

