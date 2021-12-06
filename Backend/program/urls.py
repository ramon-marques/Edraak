from django.urls import path, include
from program import views

from rest_framework.routers import DefaultRouter

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'', views.ProgramsView)


urlpatterns = [
    path('', include(router.urls)),
    path('<int:pk>/applications', views.applications_by_program),
    path('<int:pk>/activities', views.activities_by_program),
    path('<int:pk>/templates', views.templates_by_program),
    path('categories/', views.categories),
    path('savetemplate', views.save_template),
]
