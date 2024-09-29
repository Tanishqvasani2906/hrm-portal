from django.contrib import admin
from attendance.models import Attendance

# Register your models here.

class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('employee', 'is_present', 'is_leave', 'created_date')

admin.site.register(Attendance, AttendanceAdmin)