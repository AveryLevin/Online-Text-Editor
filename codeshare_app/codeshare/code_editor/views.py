from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

# Create your views here.
def project_edit(request, proj_id):
    context = {}
    return render(request, 'code_editor/project_edit.html', context)

def quick_edit(request):
    context = {}
    return render(request, 'code_editor/quick_edit.html', context)
