# Generated by Django 5.0.7 on 2024-09-08 08:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('salaryslip', '0007_salaryslip_approved_by_salaryslip_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='salaryslip',
            name='net_pay',
            field=models.DecimalField(decimal_places=2, max_digits=10),
        ),
    ]