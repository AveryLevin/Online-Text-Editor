from django.contrib import admin
from .models import Project, ProjItem, FileItem
# Register your models here.
admin.site.register(Project)
admin.site.register(ProjItem)
admin.site.register(FileItem)