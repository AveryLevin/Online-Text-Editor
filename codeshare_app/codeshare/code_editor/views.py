from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from accounts.views import get_user_or_None

# Create your views here.


def project_edit(request, proj_id, file_id):
    context = {}
    return render(request, 'code_editor/project_edit.html', context)


def quick_edit(request):

    user = get_user_or_None(request)

    if user:
        context = {
            'logged_in': True,
            'user': user
        }
    else:
        context = {
            'logged_in': False,
            'user': None
        }
    return render(request, 'code_editor/quick_edit.html', context)
