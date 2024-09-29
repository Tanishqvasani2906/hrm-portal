from rest_framework import serializers
from attendance.models import Attendance
from account.models import User
from employee.models import EmployeeDetails

class AttendanceSerializer(serializers.ModelSerializer):
    employee = serializers.CharField()

    class Meta:
        model = Attendance
        fields = ['employee', 'is_present', 'created_date', 'is_leave']

    def validate_employee(self, value):
        request = self.context.get('request')
        date = request.parser_context.get('kwargs').get('date')

        if date:
            try:
                user = User.objects.get(username=value)
                employee = EmployeeDetails.objects.get(user=user)
            except User.DoesNotExist:
                raise serializers.ValidationError("User with this username does not exist.")
            except EmployeeDetails.DoesNotExist:
                raise serializers.ValidationError("Employee details not found for this user.")
        else:
            try:
                user = User.objects.get(email=value)
                employee = EmployeeDetails.objects.get(user=user)
            except User.DoesNotExist:
                raise serializers.ValidationError("User with this email does not exist.")
            except EmployeeDetails.DoesNotExist:
                raise serializers.ValidationError("Employee details not found for this user.")
        return employee

    def create(self, validated_data):
        employee = validated_data.pop('employee')
        attendance = Attendance.objects.create(employee=employee, **validated_data)
        return attendance

    
class AttendanceGetSerializer(serializers.ModelSerializer):
    user = serializers.EmailField(source='employee.user.email', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'user', 'is_present', 'created_date']
        
        
class AttendanceDateSerializer(serializers.ModelSerializer):
    working_emailid = serializers.CharField(source='employee.working_emailid', read_only=True)
    name = serializers.CharField(source='employee.name', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'working_emailid', 'name', 'is_present', 'is_leave', 'created_date']