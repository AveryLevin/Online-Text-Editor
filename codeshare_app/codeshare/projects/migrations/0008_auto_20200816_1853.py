# Generated by Django 3.0.7 on 2020-08-17 01:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0007_auto_20200814_1440'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fileitem',
            name='contents',
            field=models.TextField(default=''),
        ),
    ]
