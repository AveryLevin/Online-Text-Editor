from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from accounts.views import get_user_or_None
from .models import Project, ProjItem, FileItem
from codeshare.utils import put_in_json_format, get_files_in_proj_or_folder, load_project_home_json, get_valid_file_extensions, get_file_type_from_extension
from code_editor.views import project_edit
from code_editor.models import ProgrammingLanguage

import json

# === UTILITIES ===

def get_item_proj(item):
    pass

# === VIEWS ===


def project_home(request, proj_id):
    # TODO: require a login and check user permissions
    try:
        open_project = Project.objects.get(pk=proj_id)

    except Exception as project_exception:
        return render(request, 'page_not_found.html')

    if request.method == 'POST':
        data = request.body
        if data:
            data = json.loads(data)
            action = data.get('action')
            prev_breadcrumb = data.get('prev_breadcrumb')
            currently_open = open_project if len(
                prev_breadcrumb) == 1 else ProjItem.objects.get(pk=prev_breadcrumb[-1].get('id'))

            if action == 'create_folder':
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
            elif action == 'create_file':
                file_name = data.get('name')
                dot_index = file_name.find('.')

                if dot_index > 1:
                    extension = file_name[dot_index:len(file_name)]
                    file_name = file_name[0:dot_index]
                    print("file extension:", extension)
                    file_type = get_file_type_from_extension(extension)
                    if file_type:
                        file_content = FileItem(file_extension=extension, language=file_type)
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
            elif action == 'delete_files':
                for file_id in data.get('files'):
                    file = ProjItem.objects.get(pk=file_id)
                    print("deleting", file.name)
                    file.soft_deleted = True
                    file.save()
                    breadcrumb = prev_breadcrumb
            else:
                file_id = data.get('id')

                if action == 'open_file':
                    file_to_open = currently_open.contents.get(pk=file_id)
                    if not file_to_open.is_folder:
                        print("opening file", file_to_open.name)
                        return HttpResponseRedirect(reverse('code_editor:project_edit', kwargs={'proj_id': open_project.id, 'file_id': file_id}))
                    breadcrumb = prev_breadcrumb + \
                        put_in_json_format([file_to_open], 'breadcrumb')
                elif action == 'goto_breadcrumb':
                    file_to_open = open_project if data.get('this_breadcrumb').get(
                        'is_root') else ProjItem.objects.get(pk=file_id)
                    # TODO: check that ProjItem is in same project as currently_open
                    breadcrumb = prev_breadcrumb[:1 +
                                                 prev_breadcrumb.index(data.get('this_breadcrumb'))]

                print("opening:", file_to_open)
                currently_open = file_to_open

            request.session['file_context'] = load_project_home_json(
                breadcrumb, currently_open, open_project)

            return JsonResponse(data=request.session.get('file_context'))
    else:
        currently_open = open_project
        breadcrumb = put_in_json_format([currently_open], 'breadcrumb')

        data = load_project_home_json(breadcrumb, currently_open, open_project)
        if 'file_context' in request.session:
            print("file context already provided")
            data = request.session.get('file_context')

    return render(request, 'projects/project_home.html', data)
