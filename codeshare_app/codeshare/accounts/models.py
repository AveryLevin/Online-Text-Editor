from django.db import models
from django.contrib.auth.models import User
from django_mysql.models import JSONField

# Create your models here.
class UserAccount(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # owned_projects = one-to-many(Project)

    # accessible_projects = many-to-many(Project)

    # preferences = JSONField(blank=True, default=dict)

    friends = models.ManyToManyField('self', blank=True)

    def __str__(self):
        return self.user.username