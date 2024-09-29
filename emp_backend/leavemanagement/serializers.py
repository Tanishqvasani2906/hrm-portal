from rest_framework import serializers
from account.models import User
from employee.models import EmployeeDetails
from leavemanagement.models import LeaveManagement

class LeaveManagementSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    
    class Meta:
        model = LeaveManagement
        fields = ['email', 'leave_type', 'from_date', 'to_date', 'reason', 'status', 'pending_work_of_employee']
        
    def validate_email(self, value):
        try:
            emp_details = EmployeeDetails.objects.get(user__email=value)
        except EmployeeDetails.DoesNotExist:
            raise serializers.ValidationError("Employee with this email does not exist.")
        return emp_details

    def create(self, validated_data):
        emp_details = validated_data.pop('email')
        leave_management = LeaveManagement.objects.create(emp_details=emp_details, **validated_data)
        return leave_management
    
class LeaveFetchSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()
    # id = serializers.IntegerField(source='id')

    class Meta:
        model = LeaveManagement
        fields = [ 'emp_details', 'leave_type', 'from_date', 'to_date', 'reason', 'status', 'pending_work_of_employee', 'is_admin']

    def get_is_admin(self, obj):
        return obj.emp_details.user.is_admin
    
    # def get_emp_id(self, obj):
    #     # This will return the working_emailid of the related EmployeeDetails model
    #     return obj.emp_details.working_emailid
    
class AdminLeaveFetchSerializer(serializers.ModelSerializer):
    emp_id = serializers.SerializerMethodField()  # Use SerializerMethodField for custom logic
    ID = serializers.IntegerField(source='pk')  # Add the primary key as 'leave_no'

    class Meta:
        model = LeaveManagement
        fields = ['ID', 'emp_details', 'leave_type', 'from_date', 'to_date', 'reason', 'status', 'pending_work_of_employee', 'emp_id']

    def get_emp_id(self, obj):
        # This will return the working_emailid of the related EmployeeDetails model
        return obj.emp_details.working_emailid

    
class LeaveStatusUpdateSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=LeaveManagement.STATUS_CHOICES)

    class Meta:
        model = LeaveManagement
        fields = ['status']
    
# class LeaveSearchSerializer(serializers.ModelSerializer):
#     from_date = serializers.DateField()
#     to_date = serializers.DateField()
    
#     class Meta:
#         model = LeaveManagement
#         fields = ['from_date', 'to_date', 'status']
        
#     def search(self, validate_data):
#         return LeaveManagement.objects.filter(from_date__gte=validate_data['from_date'], to_date__gte=validate_data['to_date'])