# Generated by Django 5.0.7 on 2024-09-25 15:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0003_userusername'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]
