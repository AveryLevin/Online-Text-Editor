# Generated by Django 3.0.7 on 2020-07-30 03:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0003_auto_20200709_1338'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='modified_date',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
