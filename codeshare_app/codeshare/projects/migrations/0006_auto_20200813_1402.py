# Generated by Django 3.0.7 on 2020-08-13 21:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0005_auto_20200808_1750'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='soft_deleted',
            field=models.BooleanField(default=False),
        ),
    ]
