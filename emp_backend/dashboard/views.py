from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from rest_framework import status
from attendance.models import Attendance
from account.renderers import UserRenderer
from .serializers import FetchTaskSerializer, TodayTaskSerializer
from dashboard.models import TodayTasks
from employee.models import EmployeeDetails
from django.utils import timezone

class AttendanceCountAPIView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        
        current_date = now()

        attendance_records = Attendance.objects.filter(
            employee__user=user,
            created_date__year=current_date.year,
            created_date__month=current_date.month
        )
        
        present_count = attendance_records.filter(is_present=True).count()
        
        total_days = attendance_records.count()

        data = {
            'total_days': total_days,
            'present_days': present_count,
        }
        
        return Response(data, status=status.HTTP_200_OK)

class TodayTaskAPIView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def get(self, request):
        user = request.user
        
        employee = EmployeeDetails.objects.filter(user=user).first()
        
        if not employee:
            return Response({'error': 'Employee details not found for the current user.'}, status=status.HTTP_404_NOT_FOUND)
        
        today = timezone.now()
        print(today)
        tasks = TodayTasks.objects.filter(employee=employee, created_date__date=today)

        task_data = [
            {
                'id': task.id,
                'task_description': task.task_description,
                'task_status': task.task_status,
            }
            for task in tasks
        ]
        
        data = {
            'tasks': task_data
        }
        
        return Response(data, status=status.HTTP_200_OK)
    
    def delete(self, request, task_id):
        user = request.user
        
        employee = EmployeeDetails.objects.filter(user=user).first()
        
        if not employee:
            return Response({'error': 'Employee details not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        task = get_object_or_404(TodayTasks, id=task_id, employee=employee)
        
        task.delete()
        
        return Response({'message': 'Task deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    

    def post(self, request, *args, **kwargs):
        user = request.user
        
        employee = EmployeeDetails.objects.filter(user=user).first()
        
        if not employee:
            return Response({'error': 'Employee details not found for the current user.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TodayTaskSerializer(data=request.data)

        if serializer.is_valid():
            task = serializer.save(employee=employee)
            return Response({
                'message': 'Your task added successfully',
                'task': FetchTaskSerializer(task).data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)