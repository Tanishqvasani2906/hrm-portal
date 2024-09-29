from django.forms import ValidationError
from django.utils import timezone
from django.db import models
from employee.models import EmployeeDetails

class Attendance(models.Model):
    employee = models.ForeignKey(EmployeeDetails, null=True, on_delete=models.CASCADE)
    is_present = models.BooleanField(default=False)
    is_leave = models.BooleanField(default=False)
    created_date = models.DateTimeField(default=timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Only raise a ValidationError if creating a new record
        if self.pk is None:
            created_date_date = self.created_date.date()
            if Attendance.objects.filter(employee=self.employee, created_date__date=created_date_date).exists():
                raise ValidationError(f"Duplicate entry for employee {self.employee} on {created_date_date}.")
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee} - {self.created_date}"