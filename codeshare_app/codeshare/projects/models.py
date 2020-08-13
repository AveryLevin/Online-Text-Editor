from django.db import models
from accounts.models import UserAccount
from code_editor.models import ProgrammingLanguage

# Create your models here.


class Project(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(
        UserAccount, null=True, on_delete=models.SET_NULL, related_name='owned_projects')
    accessors = models.ManyToManyField(
        UserAccount, blank=True, related_name='accessible_projects')
    # accessor_permissions =
    start_date = models.DateTimeField(auto_now_add=True, editable=False)
    modified_date = models.DateTimeField(auto_now=True)
    soft_deleted = models.BooleanField(default=False)
    # contents = one-to-many(ProjItem)

    def __str__(self):
        return self.name


class FileItem(models.Model):
    # container = one-to-one(ProjItem)
    contents = models.TextField()
    file_extension = models.CharField(max_length=10)
    language = models.ForeignKey(
        ProgrammingLanguage, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        try:
            return self.container.name
        except:
            return 'File {} -- NO CONTAINER'.format(str(self.id))


class ProjItem(models.Model):
    name = models.CharField(max_length=50)
    soft_deleted = models.BooleanField(default=False)
    # RULE: root_proj will be null unless it is in the root dir of that project
    root_proj = models.ForeignKey(
        Project, null=True, blank=True, on_delete=models.SET_NULL, related_name='contents')
    # RULE: folder_dir will be null unless root_proj is null
    folder_dir = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL, related_name='contents')
    is_folder = models.BooleanField()
    create_date = models.DateTimeField(auto_now_add=True)
    last_edit_date = models.DateTimeField(auto_now=True)
    # contents (for folders) = one-to-many(ProjItem)
    # RULE: file_contents will be null unless is_folder is False
    file_contents = models.OneToOneField(
        FileItem, null=True, blank=True, on_delete=models.SET_NULL, related_name='container')
    # slug =

    def __str__(self):
        return self.name
