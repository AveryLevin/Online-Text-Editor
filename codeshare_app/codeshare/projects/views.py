from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from accounts.views import get_user_or_None
from .models import Project, ProjItem, FileItem
from codeshare.utils import put_in_json_format

# Create your views here.

# === UTILITIES ===

def get_contributers(proj):
    """Returns all UserAccounts with access to given 'proj'."""
    return proj.accessors.all()

def get_files_in_proj(proj):
    """Returns all files in given 'proj'."""
    all_files = proj.contents.all()
    print(all_files)
    return(all_files)

# === VIEWS ===

def project_home(request, proj_id):

    try:
        open_project = Project.objects.get(pk=proj_id)
    except Exception as project_exception:
        return render(request, 'page_not_found.html')

    context = {
        'breadcrumb': put_in_json_format([open_project], 'breadcrumb'),
        'proj_files': put_in_json_format(get_files_in_proj(open_project), 'files'),
        'contributers': put_in_json_format(get_contributers(open_project), 'users'),
    }

    return render(request, 'projects/project_home.html', context)
