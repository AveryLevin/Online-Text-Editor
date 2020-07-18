from django.urls import path

from . import views
from django.conf import settings 
from django.conf.urls.static import static

# namespace
app_name = 'code_editor'

urlpatterns = [
    path('proj_<int:proj_id>/', views.project_edit, name='project_edit'),
    path('', views.quick_edit, name='quick_edit'),
    
]