from django.urls import path
from attendance.views import AttendanceSerializerGetView, AttendanceSerializerView, CurrentDateAttendanceView

urlpatterns = [
    path('employeAttendance/add/', AttendanceSerializerView.as_view(), name='attendance'),
    path('employeAttendance/add/<str:date>/', AttendanceSerializerView.as_view(), name='attendance'),
    path('attendance/user/', AttendanceSerializerGetView.as_view(), name='attendance-detail'),
    path('attendance/current/', CurrentDateAttendanceView.as_view(), name='current-attendance'),
]