"""edraakapplications URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.conf import settings

from program import urls as program_urls
from application import urls as program_application_urls
from account import urls as user_application_urls


urlpatterns = [
    path('admin/', admin.site.urls),
    path('programs/', include(program_urls)),
    path('applications/', include(program_application_urls)),
    path('users/', include(user_application_urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
