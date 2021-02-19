from django.urls import path

from . import views
from django.conf import settings 
from django.conf.urls.static import static

# namespace
app_name = 'projects'

urlpatterns = [
    path('proj_<int:proj_id>/', views.project_home, name='project_home'),
]