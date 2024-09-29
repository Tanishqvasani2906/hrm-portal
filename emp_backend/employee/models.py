from django.db import models
from account.models import User

# Create your models here.

class EmployeeDetails(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='employee_details')
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    personal_mailid = models.EmailField(max_length=100, blank=True, null=True)
    working_designation = models.CharField(max_length=50, blank=True, null=True)
    department = models.CharField(max_length=50, blank=True, null=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    working_emailid = models.EmailField(max_length=100, unique=True)
    emp_id = models.CharField(max_length=50, unique=True)
    date_of_birth = models.DateField(blank=True, null=True)
    date_of_joining = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        if hasattr(self, 'use_email') and self.use_email:
            return self.working_emailid
        return self.user.username