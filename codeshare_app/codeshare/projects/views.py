from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from accounts.views import get_user_or_None
from .models import Project, ProjItem, FileItem
from codeshare.utils import put_in_json_format
from code_editor.views import project_edit

import json

# === UTILITIES ===

def get_contributers(proj):
    """Returns all UserAccounts with access to given 'proj'."""
    return proj.accessors.all()

def get_files_in_proj_or_folder(item):
    """Returns all files in given 'proj'."""
    all_files = item.contents.all()
    print(all_files)
    return(all_files)

def load_project_home_json(breadcrumb, currently_open, open_project):
    """Returns a loaded JSON based off the current state of the page."""
    return {
        'breadcrumb': breadcrumb,
        'proj_files': put_in_json_format(get_files_in_proj_or_folder(currently_open), 'files'),
        'contributers': put_in_json_format(get_contributers(open_project), 'users'),
    }

def get_item_proj(item):
    pass
# === VIEWS ===

def project_home(request, proj_id):
    
    try:
        open_project = Project.objects.get(pk=proj_id)
        
    except Exception as project_exception:
        return render(request, 'page_not_found.html')

    if request.method == 'POST':
        data = request.body
        if data:
            data = json.loads(data)
            action = data.get('action')
            file_id = data.get('id')          
            prev_breadcrumb = data.get('prev_breadcrumb')
            currently_open = open_project if len(prev_breadcrumb) == 1 else ProjItem.objects.get(pk=prev_breadcrumb[-1].get('id'))

            if action == 'open_file':
                file_to_open = currently_open.contents.get(pk=file_id)
                if not file_to_open.is_folder:
                    print("opening file", file_to_open.name)
                    return HttpResponseRedirect(reverse('code_editor:project_edit',kwargs={'proj_id': open_project.id, 'file_id': file_id}))
                breadcrumb = prev_breadcrumb + put_in_json_format([file_to_open], 'breadcrumb')
            elif action == 'goto_breadcrumb':
                file_to_open = open_project if data.get('this_breadcrumb').get('is_root') else ProjItem.objects.get(pk=file_id)
                # TODO: check that ProjItem is in same project as currently_open
                breadcrumb  = prev_breadcrumb[:1+prev_breadcrumb.index(data.get('this_breadcrumb'))]

            print("opening:", file_to_open)
            currently_open = file_to_open
            return JsonResponse(data=load_project_home_json(breadcrumb, currently_open, open_project))
    else:
        currently_open = open_project
        breadcrumb = put_in_json_format([currently_open], 'breadcrumb')

    return render(request, 'projects/project_home.html', load_project_home_json(breadcrumb, currently_open, open_project))
