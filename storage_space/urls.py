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
from django.urls import path,include,re_path
from client import views


urlpatterns = [
    
    re_path(r"^page_movements/move_items/",views.move_items,name='move_items'),
    path('admin/', admin.site.urls,name='admin'),
    path('',views.index,name='home'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('get_bd/', views.bd_get, name='bd_get'),
    path('confirm_the_transfer/',views.confirm_transfer,name='confirm_transfer'),
    path('get_logs/',views.get_logs,name='get_logs'),
    path('get_item/',views.get_item,name='get_item'),
    path('get_item_confirm/',views.get_item_confirm,name='get_item_confirm'),
    path('check_movements/',views.check_movements,name='check_movements'),
    path( 'page_movements/',views.page_movements,name='page_movements'),
    path( 'page_movements/get_cell_data/',views.get_cell_data,name='get_cell_data'),
    
  
]
