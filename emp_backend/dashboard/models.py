from django.db import models
from employee.models import EmployeeDetails

# Create your models here.

class TodayTasks(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
    ]
    
    employee = models.ForeignKey(EmployeeDetails, on_delete=models.CASCADE)
    task_description = models.TextField()
    task_status = models.CharField(max_length=10, default='Pending')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Today`s Task'
        verbose_name_plural = 'Today Tasks'
    
    def __str__(self):
        return self.employee.user.username