# Generated by Django 5.0.7 on 2024-09-27 09:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attendance', '0003_alter_attendance_created_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='attendance',
            name='is_leave',
            field=models.BooleanField(default=False),
        ),
    ]
