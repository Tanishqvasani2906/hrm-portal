from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import SalarySlip, EmployeeDetails

User = get_user_model()

class SalarySlipSerializer(serializers.ModelSerializer):
    employee = serializers.CharField(write_only=True)
    emp_id = serializers.CharField()
    prepared_by = serializers.EmailField(write_only=True)
    approved_by = serializers.EmailField(write_only=True)

    class Meta:
        model = SalarySlip
        fields = [
            'employee', 'emp_id', 'designation', 'month', 'year', 'department', 'date_of_joining',
            'basic_salary', 'allowances', 'deductions', 'net_pay',
            'prepared_by', 'approved_by'
        ]

    def create(self, validated_data):
        employee_username = validated_data.pop('employee', None)
        emp_id = validated_data.get('emp_id')
        prepared_by_email = validated_data.pop('prepared_by', None)
        approved_by_email = validated_data.pop('approved_by', None)

        try:
            employee = EmployeeDetails.objects.get(user__username=employee_username)
            if emp_id != employee.emp_id:
                employee.emp_id = emp_id
                employee.save()
            validated_data['employee'] = employee
        except EmployeeDetails.DoesNotExist:
            raise serializers.ValidationError(f"Employee with username '{employee_username}' does not exist.")

        try:
            prepared_by = User.objects.get(email=prepared_by_email)
            validated_data['prepared_by'] = prepared_by
        except User.DoesNotExist:
            raise serializers.ValidationError(f"User with email '{prepared_by_email}' does not exist.")

        try:
            approved_by = User.objects.get(email=approved_by_email)
            validated_data['approved_by'] = approved_by
        except User.DoesNotExist:
            raise serializers.ValidationError(f"User with email '{approved_by_email}' does not exist.")

        return SalarySlip.objects.create(**validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee'] = instance.employee.user.username if instance.employee else None
        representation['prepared_by'] = instance.prepared_by.email if instance.prepared_by else None
        representation['approved_by'] = instance.approved_by.email if instance.approved_by else None
        return representation

class SalarySlipViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalarySlip
        exclude = ['created_at', 'updated_at', 'id']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['employee'] = instance.employee.user.username if instance.employee else None
        representation['prepared_by'] = instance.prepared_by.email if instance.prepared_by else None
        representation['approved_by'] = instance.approved_by.email if instance.approved_by else None
        
        return representation
