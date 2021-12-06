import json

from datetime import datetime

from django.db import models
from django.db.models import Case, When
from django.core import serializers
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from django.utils.timezone import (
    make_aware,
    get_default_timezone,
)

from utils.constants import PROGRAM_STATUSES, TIMEZONES

class ProgramCategory(models.Model):
    name_en = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100)
    order = models.IntegerField(default=1)
    cover_image = models.ImageField(
        upload_to='category/images/',
        blank=True,
        null=True,
        )

    def __str__(self):
        return self.name_en


class Program(models.Model):
    LANGUAGES = (
        ('en', _('English')),
        ('ar', _('Arabic')),
    )

    # Basic settings
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    name_en = models.CharField(max_length=255)

    about_en = models.TextField(null=True, blank=True)

    short_description = models.TextField(
        null=True, blank=True, max_length=155)
    
    content_language = models.CharField(
        max_length=2, choices=LANGUAGES, default='en')
    category = models.ForeignKey(ProgramCategory, null=True, blank=True, on_delete=models.DO_NOTHING)
    effort = models.IntegerField(null=True, blank=True)
    self_paced = models.BooleanField(default=False)
    cover_image = models.ImageField(
        upload_to='program/images/',
        blank=True,
        null=True,
        )
    square_image = models.ImageField(
        upload_to='program/images/',
        blank=True,
        null=True,
        )

    show_in_marketing = models.BooleanField(default=False)

    # Dates and enrollment
    start = models.DateTimeField(null=True)
    end = models.DateTimeField(blank=True, null=True)

    # Enrollment related
    enrollment_start = models.DateTimeField(blank=True, null=True)
    enrollment_end = models.DateTimeField(blank=True, null=True)
    enrollment_domains = models.CharField(
        max_length=255, null=True, blank=True)
    seats_limit = models.PositiveIntegerField(default=0, null=True, blank=True)
    instantiated_from = models.ForeignKey(
        blank=True, null=True, to='program.Program', on_delete=models.DO_NOTHING)

    # Versioning
    deprecated = models.BooleanField(max_length=255, default=False)

    # Timezone for defining release and due dates
    default_timezone = models.CharField(
        max_length=255,
        choices=TIMEZONES,
        default='Asia/Amman')

    def get_enrollments_count(self):
        return User.objects.filter(
            groups__name='student_{}'.format(self.slug)).count()

    def get_slug_no_slashes(self):
        if self.slug:
            return self.slug.replace("/", "-")
        else:
            return None

    def to_json(self):
        data = json.loads(serializers.serialize('json', [self]))[0]

        data_fields_and_id = data['fields']
        data_fields_and_id['id'] = data['pk']

        return json.dumps(data_fields_and_id)

    @property
    def status(self):
        time_now = make_aware(datetime.now(), get_default_timezone())
        try:
            if time_now > self.end:
                return PROGRAM_STATUSES['finished']
            elif time_now >= self.start:  # start_date is the first day in the course
                return PROGRAM_STATUSES['current']
            elif time_now < self.start:  # Learners can enroll in enrollment start date
                return PROGRAM_STATUSES['upcoming']
            else:  # Learners cannot enroll in this course yet
                return PROGRAM_STATUSES['hidden']
        except TypeError:
            try:
                if time_now >= self.start:
                    return PROGRAM_STATUSES['current']
                elif time_now < self.start:  # Learners can enroll in enrollment start date
                    return PROGRAM_STATUSES['upcoming']
                else:  # Learners cannot enroll in this course yet
                    return PROGRAM_STATUSES['hidden']
            except TypeError:
                return PROGRAM_STATUSES['hidden']

    @property
    def clean_name_en(self):
        return self.name_en.strip()

    @property
    def is_full(self):
        return self.seats_limit > 0 and self.get_enrollments_count() >= self.seats_limit

    @property
    def program_type(self):
        return self.slug.split('/')[0] if self.slug else ''

    @property
    def square_image_url(self):
        try:
            return self.square_image.url
        except ValueError:
            return ''

    def get_length_display(self):
        if self.self_paced:
            return 0

        delta = self.end - self.start
        return int(delta.days / 7)

    def get_start_display(self):
        return self.start.strftime('%-d.%-m.%Y')

    def __str__(self):
        return self.name_en

    def get_url(self):
        return '{}learn/{}'.format(settings.PROGS_BASE, self.slug)

    def get_enrolled_users(self, subscribed=None):
        queryset = self.enrollments.filter(is_active=True)

        if subscribed:
            queryset = queryset.exclude(
                user_id__in=self.unsubscribed_users.values_list('user_id', flat=True))
        elif subscribed is False:
            queryset = queryset.filter(
                user_id__in=self.unsubscribed_users.values_list('user_id', flat=True))

        user_ids = list(queryset.values_list('user_id', flat=True))
        return get_user_model().objects.filter(id__in=user_ids)

    def get_subscribed_users(self):
        """Returns users who are subscribed to program emails"""
        return self.get_enrolled_users(subscribed=True)

    def get_unsubscribed_users(self):
        """Returns users who are unsubscribed to program emails"""
        return self.get_enrolled_users(subscribed=False)

    def is_user_subscribed(self, user):
        return not self.unsubscribed_users.filter(user_id=user.id).exists()


class ProgramMessagesLog(models.Model):
    """
    represent a log for sent emails by program teachers/staff to all or selected list of
    program enrollers
    """
    user_id = User
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    subject = models.CharField(max_length=300)
    content = models.TextField()
    recipients = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

