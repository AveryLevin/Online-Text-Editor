# Generated by Django 3.0.7 on 2020-07-09 20:33

from django.db import migrations
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_useraccount'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useraccount',
            name='preferences',
            field=django_mysql.models.JSONField(blank=True, default=dict),
        ),
    ]
