# Generated by Django 4.0.4 on 2022-10-22 16:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('timetable', '0004_routinetask_percent'),
    ]

    operations = [
        migrations.RenameField(
            model_name='routinetask',
            old_name='done',
            new_name='streakes',
        ),
    ]
