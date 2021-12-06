from django.db import models
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
import utils.constants as constants

from program.models import Program

from django.utils.timezone import (
    make_aware,
    get_default_timezone,
)

from utils.constants import PROGRAM_STATUSES, TIMEZONES

class ProgramApplication(models.Model):
    user    = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, related_name='applications', on_delete=models.CASCADE)
    tech_exam = models.IntegerField(
        blank=True, 
        null=True,
        validators=[
            MaxValueValidator(100),
            MinValueValidator(0)
        ]
    )
    english_exam = models.IntegerField(
        blank=True, 
        null=True,
        validators=[
            MaxValueValidator(100),
            MinValueValidator(0)
        ]
    )
    interview_grade =models.IntegerField(
        blank=True, 
        null=True,
        validators=[
            MaxValueValidator(100),
            MinValueValidator(0)
        ]
    )
    state = models.CharField(max_length=255, blank=True, 
        null=True, choices=constants.STATE_CHOICES)

    activities = models.ManyToManyField('Activity', through = 'ApplicationActivity')

    created = models.DateTimeField(auto_now_add=True, db_index=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.program.name_en + '-' + self.user.get_full_name()


class Activity(models.Model):
    program = models.ForeignKey(Program, related_name='activities', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)

    class Meta:
        ordering = ['pk']

    def __str__(self):
        return self.title


class ApplicationActivity(models.Model):
    activity = models.ForeignKey(Activity, related_name='activity_application', on_delete=models.CASCADE)
    application = models.ForeignKey(ProgramApplication, related_name='application_activity', on_delete=models.CASCADE)
    grade =models.IntegerField(
        blank=True, 
        null=True,
        validators=[
            MaxValueValidator(100),
            MinValueValidator(0)
        ]
    )
    passed = models.BooleanField(default=False)

    def __str__(self):
        return self.application.program.name_en + '-' + self.application.user.get_full_name() + '-' + self.activity.title






