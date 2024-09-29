import datetime
from datetime import datetime
from django.db import IntegrityError
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.renderers import UserRenderer
from rest_framework.permissions import IsAuthenticated
from account.models import User
from .serializers import AttendanceDateSerializer, AttendanceGetSerializer, AttendanceSerializer
from attendance.models import Attendance
from employee.models import EmployeeDetails
from django.db.models.functions import TruncDate
from collections import OrderedDict
from django.db import IntegrityError

class AttendanceSerializerView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, date=None, format=None):
        if not isinstance(request.data, list):
            return Response({'msg': 'Invalid data format, expected a list of records.'}, status=status.HTTP_400_BAD_REQUEST)

        if date:
            try:
                submission_date = datetime.strptime(date, '%Y-%m-%d').date()
            except ValueError:
                return Response({'msg': 'Invalid date format, expected YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            submission_date = timezone.now().date()

        successful_updates = 0
        errors = []

        for record in request.data:
            if 'employee' in record and isinstance(record['employee'], str):
                try:
                    employee_instance = EmployeeDetails.objects.get(working_emailid=record['employee'])
                except EmployeeDetails.DoesNotExist:
                    errors.append(f'Employee with email {record["employee"]} does not exist.')
                    continue
            else:
                serializer = AttendanceSerializer(data=record, context={'request': request})
                if serializer.is_valid():
                    employee_instance = serializer.validated_data['employee']
                else:
                    errors.append(serializer.errors)
                    continue

            status_value = record.get('status')

            record_date = submission_date

            if record_date > timezone.now().date():
                errors.append(f'Cannot submit attendance for a future date. Today is {timezone.now().date()}.')
                continue

            record_date_time = timezone.make_aware(datetime.combine(record_date, datetime.min.time()))

            try:
                attendance_record = Attendance.objects.get(
                    employee=employee_instance,
                    created_date__date=record_date
                )
                attendance_record.is_present = status_value == "PRESENT"
                attendance_record.is_leave = status_value == "LEAVE"
                attendance_record.save()
                successful_updates += 1

            except Attendance.DoesNotExist:
                attendance_record = Attendance(
                    employee=employee_instance,
                    created_date=record_date_time,
                    is_present=status_value == "PRESENT",
                    is_leave=status_value == "LEAVE"
                )
                try:
                    attendance_record.save()
                    successful_updates += 1
                except IntegrityError:
                    errors.append(f'Duplicate entry for employee {employee_instance} on {record_date}.')

        response_data = {
            'msg': f'Attendance updated successfully for {successful_updates} records.',
            'errors': errors if errors else None
        }

        if successful_updates == 0 and errors:
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    def get(self, request, date=None, format=None):
        if date:
            try:
                requested_date = datetime.strptime(date, "%Y-%m-%d").date()
                requested_datetime = timezone.make_aware(datetime.combine(requested_date, datetime.min.time()))
            except ValueError:
                return Response({'msg': 'Invalid date format, expected YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            requested_datetime = timezone.now()

        attendance_records = Attendance.objects.filter(created_date__date=requested_datetime.date())

        if not attendance_records.exists():
            all_employees = EmployeeDetails.objects.all()
            attendance_records = []
            
            for employee in all_employees:
                attendance_record, created = Attendance.objects.get_or_create(
                    employee=employee,
                    created_date=requested_datetime,
                    defaults={'is_present': False, 'is_leave': False}
                )
                attendance_records.append(attendance_record)

        serializer = AttendanceDateSerializer(attendance_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
class AttendanceSerializerGetView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        employee_details = EmployeeDetails.objects.filter(user=user).first()
        if not employee_details:
            return Response({'error': 'Employee details not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        attendances = Attendance.objects.filter(employee=employee_details).annotate(date_only=TruncDate('created_date')).order_by('date_only')
        
        unique_attendances = OrderedDict()
        for attendance in attendances:
            if attendance.date_only not in unique_attendances:
                unique_attendances[attendance.date_only] = attendance
                
        distinct_attendances = list(unique_attendances.values())
        
        serializer = AttendanceGetSerializer(distinct_attendances, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class CurrentDateAttendanceView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        attendance_records = Attendance.objects.filter(created_date__date=today)
        all_employees = EmployeeDetails.objects.all()
        
        attendance_summary = []

        for employee in all_employees:
            attendance_record = attendance_records.filter(employee=employee).first()
            attendance_status = {
                'employee': employee.user.email,
                'name': f"{employee.first_name} {employee.last_name}",
                'status': 'PRESENT' if attendance_record and attendance_record.is_present else 
                          'LEAVE' if attendance_record and attendance_record.is_leave else 'ABSENT',
                'is_recorded': attendance_record is not None
            }
            attendance_summary.append(attendance_status)

        return Response({
            'date': today.isoformat(),
            'is_today': True,
            'attendance': attendance_summary
        }, status=status.HTTP_200_OK)