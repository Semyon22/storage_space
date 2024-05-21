"""
URL configuration for storage_space project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.contrib import admin
from django.urls import path,include
from client import views


urlpatterns = [
    path('admin/', admin.site.urls,name='admin'),
    path('',views.index,name='home'),
    path('get_logs/',views.get_logs,name='get_logs'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('get_bd/', views.bd_get, name='bd_get'),
    path('confirm_the_transfer/',views.confirm_transfer,name='confirm_transfer'),
    
]
