# Generated by Django 3.0.7 on 2020-08-14 21:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0006_auto_20200813_1402'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projitem',
            name='soft_deleted',
            field=models.BooleanField(default=False),
        ),
    ]
