from django.contrib import admin
from .models import Activity, ApplicationActivity, ProgramApplication

admin.site.register(ProgramApplication)
admin.site.register(Activity)
admin.site.register(ApplicationActivity)



# Register your models here.
