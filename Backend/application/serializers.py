from rest_framework import serializers
from .models import Activity, ApplicationActivity, ProgramApplication
from account.serializers import UserSimpleSerializer
from django.conf import settings
from rest_framework import serializers

class ApplicationActivitySerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField(source='activity.id')
    name = serializers.ReadOnlyField(source='activity.title')

    class Meta:
        model = ApplicationActivity

        fields = ('id', 'name', 'grade', 'passed' )


class ProgramApplicationSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer()
    img_url = serializers.SerializerMethodField()
    activities = serializers.SerializerMethodField()
    #activities = ApplicationActivitySerializer(source='application_activity', many=True)


    class Meta:
        model = ProgramApplication
        fields = '__all__'

    def get_img_url(self, obj):
        if settings.DEBUG:  # debug enabled for dev and stage
            return 'http://%s%s' % ('localhost:8000', obj.user.profile_image.url)
        return obj.img.url

    #get players with a MethodField and order them by title
    def get_activities(self, instance):
        activities = instance.application_activity.order_by('activity_id')
        return ApplicationActivitySerializer(activities, many=True).data


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'