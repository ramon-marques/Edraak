from django.urls import path, include
from account import views

from rest_framework.routers import DefaultRouter

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'', views.UserView)


urlpatterns = [
    path('', include(router.urls))
]
