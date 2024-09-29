from rest_framework import serializers
from .models import Notice, EmployeeDetails

class NoticeSerializer(serializers.ModelSerializer):
    employee = serializers.CharField(write_only=True)

    class Meta:
        model = Notice
        fields = ['id', 'employee', 'title', 'content', 'end_date', 'notice_priority']

    def create(self, validated_data):
        employee_username = validated_data.pop('employee', None)

        try:
            employee = EmployeeDetails.objects.get(user__username=employee_username)
            validated_data['employee'] = employee 
        except EmployeeDetails.DoesNotExist:
            raise serializers.ValidationError({"employee": f"Employee with username '{employee_username}' does not exist."})

        return Notice.objects.create(**validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee'] = instance.employee.user.username if instance.employee else None
        return representation
