from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from accounts.views import get_user_or_None
from projects.models import Project, ProjItem, FileItem
from codeshare.utils import get_full_filename, get_files_in_proj_or_folder, put_in_json_format, load_project_home_json, get_valid_file_extensions, get_file_type_from_extension

import json

# === UTILITIES ===


def get_breadcrumb_from_file(crumb):
    json = []
    print("getting breadcrumb:")
    while crumb:
        print("\t::", crumb.name)
        json.append({
            'displayName': crumb.name if (type(crumb) == Project or crumb.is_folder) else get_full_filename(crumb),
            'id': crumb.id,
            'is_root': type(crumb) == Project,
        })
        crumb = None if type(crumb) == Project else (
            crumb.root_proj if crumb.root_proj else (
                crumb.folder_dir if crumb.folder_dir else None))
    json.reverse()
    return json


# === VIEWS ===

def project_edit(request, proj_id, file_id):

    try:
        open_project = Project.objects.get(pk=proj_id)
        open_file = ProjItem.objects.get(pk=file_id)
    except Exception as project_exception:
        return render(request, 'page_not_found.html')

    if request.method == 'POST':
        data = request.body
        if data:
            data = json.loads(data)
            action = data.get('action')

            if action == 'create_folder':
                prev_breadcrumb = data.get('prev_breadcrumb')
                currently_open = open_project if len(
                    prev_breadcrumb) == 2 else ProjItem.objects.get(pk=prev_breadcrumb[-2].get('id'))
                print("creating folder!!!")
                folder_name = data.get('name')
                if open_project == currently_open:
                    new_folder = ProjItem(
                        name=folder_name, root_proj=open_project, is_folder=True)
                else:
                    new_folder = ProjItem(
                        name=folder_name, folder_dir=currently_open, is_folder=True)
                new_folder.save()
                breadcrumb = prev_breadcrumb
                request.session['file_context'] = load_project_home_json(
                    breadcrumb, currently_open, open_project)
                return JsonResponse(data=request.session.get('file_context'))
            elif action == 'create_file':
                prev_breadcrumb = data.get('prev_breadcrumb')
                currently_open = open_project if len(
                    prev_breadcrumb) == 2 else ProjItem.objects.get(pk=prev_breadcrumb[-2].get('id'))
                file_name = data.get('name')
                dot_index = file_name.find('.')

                if dot_index > 1:
                    extension = file_name[dot_index:len(file_name)]
                    file_name = file_name[0:dot_index]
                    print("file extension:", extension)
                    file_type = get_file_type_from_extension(extension)
                    if file_type:
                        file_content = FileItem(
                            file_extension=extension, language=file_type)
                        file_content.save()
                        if open_project == currently_open:
                            new_file = ProjItem(
                                name=file_name, root_proj=open_project, is_folder=False, file_contents=file_content)
                        else:
                            new_file = ProjItem(
                                name=file_name, folder_dir=currently_open, is_folder=False, file_contents=file_content)
                        new_file.save()
                        breadcrumb = prev_breadcrumb
                    else:
                        return JsonResponse({
                            'failed': True,
                            'validExtensions': str(get_valid_file_extensions())[1:-1]
                        })
                else:
                    print("no . file extension")
                    return JsonResponse({
                        'failed': True,
                        'validExtensions': str(get_valid_file_extensions())[1:-1]
                    })
                request.session['file_context'] = load_project_home_json(
                    breadcrumb, currently_open, open_project)
                return JsonResponse(data=request.session.get('file_context'))
            elif action == 'delete_files':
                for file_id in data.get('files'):
                    file = ProjItem.objects.get(pk=file_id)
                    print("deleting", file.name)
                    file.soft_deleted = True
                    file.save()
                breadcrumb = prev_breadcrumb
                request.session['file_context'] = load_project_home_json(
                    breadcrumb, currently_open, open_project)
                return JsonResponse(data=request.session.get('file_context'))
            elif action == 'save_file':
                updated_code = data.get('new_content')
                file_id = data.get('file_id')        
                open_file = ProjItem.objects.get(pk=file_id)
                open_file.file_contents.contents = updated_code
                open_file.file_contents.save()
                return JsonResponse({
                    'save_status': True,
                })
                # END POST
            elif action == 'goto_breadcrumb':
                file_to_open = open_project if data.get('this_breadcrumb').get(
                    'is_root') else ProjItem.objects.get(pk=data.get('id'))

                # TODO: check that ProjItem is in same project as currently_open
                prev_breadcrumb = data.get('prev_breadcrumb')
                print("file 2 open:", file_to_open)
                breadcrumb = prev_breadcrumb[:1 +
                                             prev_breadcrumb.index(data.get('this_breadcrumb'))]
                request.session['file_context'] = load_project_home_json(
                    breadcrumb, file_to_open, open_project)
                return HttpResponseRedirect(reverse('projects:project_home', kwargs={'proj_id': proj_id}))
                # END POST
            elif action == 'open_file':
                prev_breadcrumb = data.get('prev_breadcrumb')
                currently_open = open_project if len(
                    prev_breadcrumb) == 2 else ProjItem.objects.get(pk=prev_breadcrumb[-2].get('id'))
                file_to_open = currently_open.contents.get(pk=data.get('id'))
                breadcrumb = prev_breadcrumb[:-1] + \
                    put_in_json_format([file_to_open], 'breadcrumb')
                if file_to_open.is_folder:
                    print("opening folder", file_to_open.name)
                    request.session['file_context'] = load_project_home_json(
                        breadcrumb, file_to_open, open_project)
                    return HttpResponseRedirect(reverse('projects:project_home', kwargs={'proj_id': proj_id}))
                    # END POST
                else:
                    print("opening file:", file_to_open.name)
                    open_file = file_to_open

                    breadcrumb = get_breadcrumb_from_file(open_file)
                    in_folder = open_file.folder_dir if open_file.folder_dir else open_file.root_proj
                    files = put_in_json_format(get_files_in_proj_or_folder(
                        in_folder), 'files', active_file=open_file.id)
                    context = {
                        'breadcrumb': breadcrumb,
                        'proj_files': files,
                        'file_content': open_file.file_contents.contents,
                    }
                    return JsonResponse(context)
                    # END POST
    breadcrumb = get_breadcrumb_from_file(open_file)
    in_folder = open_file.folder_dir if open_file.folder_dir else open_file.root_proj
    files = put_in_json_format(get_files_in_proj_or_folder(
        in_folder), 'files', active_file=open_file.id)
    context = {
        'breadcrumb': breadcrumb,
        'proj_files': files,
        'file_content': open_file.file_contents.contents,
    }
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
