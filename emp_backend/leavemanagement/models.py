from django.db import models
from employee.models import EmployeeDetails

# Create your models here.

class LeaveManagement(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    emp_details = models.ForeignKey(EmployeeDetails, on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=50, blank=False, null=True)
    from_date = models.DateField(blank=False)
    to_date = models.DateField(blank=False)
    reason = models.TextField(blank=True, default="None")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    pending_work_of_employee = models.TextField(blank=True, default="None")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Leave from {self.from_date} to {self.to_date} for {self.emp_details}"