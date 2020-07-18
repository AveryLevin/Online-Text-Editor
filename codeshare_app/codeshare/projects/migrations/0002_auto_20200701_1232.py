# Generated by Django 3.0.7 on 2020-07-01 19:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_useraccount'),
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='accessors',
            field=models.ManyToManyField(blank=True, related_name='accessible_projects', to='accounts.UserAccount'),
        ),
    ]
