from django.urls import path, include
from application import views

from rest_framework.routers import DefaultRouter

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'', views.ProgramApplicationView)


urlpatterns = [
    path('', include(router.urls)),
    path('sendemail', views.send_candidate_email),
]
