from django.urls import path

from . import views
from django.conf import settings 
from django.conf.urls.static import static

# namespace
app_name = 'accounts'

urlpatterns = [
    path('login/', views.user_login, name='user_login'),
    path('home/', views.user_home, name='user_home'),
    path('', views.user_home, name='user_home'),
    path('preferences/', views.user_pref, name='user_pref'),
    
]