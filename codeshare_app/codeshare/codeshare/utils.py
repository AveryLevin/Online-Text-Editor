from accounts.models import User, UserAccount
from projects.models import Project, ProjItem, FileItem
from code_editor.models import ProgrammingLanguage


def format_months(mo_num_string):
    """reformats a month number as a 3-letter 
    abreiviation and returns a string."""

    mo_dict = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec",
    }
    return mo_dict[mo_num_string]

def get_file_type(proj_item):
    """Returns what type of file/folder 'proj_item' is."""
    if proj_item.is_folder:
        return 'folder'
    else:
        file_item = proj_item.file_contents
        return file_item.language.name

def get_full_filename(proj_item):
    """Returns the full name of given 'proj_item' 
    including potential file extensions."""
    name = proj_item.name
    if not proj_item.is_folder:
        file_item = proj_item.file_contents
        name += file_item.file_extension
    return name

def get_files_in_proj_or_folder(item):
    """Returns all files in given 'proj'."""
    all_files = item.contents.all()
    print(all_files)
    return(all_files)

def put_in_json_format(objs, item_type, active_file=None):
    """Rewrites given object in a json-acceptable format (list, dict, etc). 
    The piece of data being input must be indicated using the 'item_type' parameter.
    \nValid item_types are:\n
    - 'projects'
    - 'users'
    - 'files'
    - 'breadcrumb'"""
    json = []
    if item_type == 'projects':
        for proj in objs:
            if not proj.soft_deleted:
                json.append(
                    {
                        'name': proj.name,
                        'id': proj.id,
                        'createDate': format_months(proj.start_date.strftime("%m")) + proj.start_date.strftime(" %d, %Y"),
                        'lastEditDate': format_months(proj.start_date.strftime("%m")) + proj.start_date.strftime(" %d, %Y"),
                    }
                )
    elif item_type == 'users':
        for user in objs:
            json.append(
                {
                    'name': user.user.username,
                }
            )
    elif item_type == 'files':
        for file in objs:
            if not file.soft_deleted:
                active = False
                if active_file and active_file == file.id:
                    active = True
                print(file.name)
                json.append(
                    {
                        'displayName': get_full_filename(file),
                        'id': file.id,
                        'edited': format_months(file.last_edit_date.strftime("%m")) + file.last_edit_date.strftime(" %d, %Y"),
                        'created': format_months(file.create_date.strftime("%m")) + file.create_date.strftime(" %d, %Y"),
                        'fileType': get_file_type(file),
                        'active': active,
                    }
                )
    elif item_type == 'breadcrumb':
        if len(objs) == 1: 
            crumb = objs[0] 
            json.append(
                {
                    'displayName': crumb.name if (type(crumb) == Project or crumb.is_folder) else get_full_filename(crumb),
                    'id': crumb.id,
                    'is_root': type(objs[0]) == Project,
                }
            )

    return json
