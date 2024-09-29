from django.db import models
from employee.models import EmployeeDetails 
import uuid
from django.utils import timezone

class Notice(models.Model):
    PRIORITY_CHOICES = [
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(EmployeeDetails, on_delete=models.CASCADE, related_name='notices', null=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    notice_priority = models.CharField(
        max_length=6,
        choices=PRIORITY_CHOICES,
        default='Medium', 
    )

    class Meta:
        db_table = 'notices'

    def is_active(self):
        today = timezone.now().date()
        return self.start_date <= today <= self.end_date
