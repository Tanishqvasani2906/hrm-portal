from django.db import models
import datetime
import uuid
from django.conf import settings
from employee.models import EmployeeDetails

class SalarySlip(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(EmployeeDetails, on_delete=models.CASCADE, related_name='salary_slips', null=True)
    emp_id = models.CharField(max_length=50, blank=True, null=True)
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    date_of_joining = models.DateField(blank=True, null=True)
    month = models.CharField(max_length=50, blank=True, null=True)
    year = models.DecimalField(max_digits=4, decimal_places=0, blank=True, null=True)
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    net_pay = models.DecimalField(max_digits=10, decimal_places=2)
    prepared_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='prepared_salary_slips', on_delete=models.SET_NULL, null=True, blank=True)
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='approved_salary_slips', on_delete=models.SET_NULL, null=True, blank=True)
    salary_slip_number = models.CharField(max_length=50, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'salary_slips'

    def save(self, *args, **kwargs):
        if not self.salary_slip_number:
            today = datetime.date.today()
            year = today.year
            prefix = f"{year % 100:02d}"
            max_number = SalarySlip.objects.filter(salary_slip_number__startswith=prefix).aggregate(models.Max('salary_slip_number'))
            last_number = int(max_number['salary_slip_number__max'][2:]) if max_number['salary_slip_number__max'] else 0
            next_number = last_number + 1
            self.salary_slip_number = f"{prefix}{next_number:08d}"
        super().save(*args, **kwargs)
