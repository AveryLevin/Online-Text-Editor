from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
# Create your views here.

def user_home(request):
    context = {}
    return render(request, 'accounts/user_home.html', context)

def user_login(request):
    context = {}
    return render(request, 'accounts/user_login.html', context)

def user_pref(request):
    context = {}
    return render(request, 'page_not_found.html', context)