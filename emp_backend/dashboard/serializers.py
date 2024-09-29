from rest_framework import serializers
from attendance.models import Attendance
from dashboard.models import TodayTasks

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'user', 'is_present']
        
class TodayTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodayTasks
        fields = ['task_description']
        
    # def get_employee_name(self, obj):
    #     return obj.employee.username if obj.employee else None
    
class FetchTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodayTasks
        fields = ['id', 'task_description']