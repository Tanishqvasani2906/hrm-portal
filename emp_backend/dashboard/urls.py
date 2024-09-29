from django.urls import path
from dashboard.views import AttendanceCountAPIView, TodayTaskAPIView

urlpatterns = [
    path('attendanceCount/', AttendanceCountAPIView.as_view(), name='attendance-count'),
    path('todaytask/', TodayTaskAPIView.as_view(), name='today-task'),
    path('delete/<int:task_id>/', TodayTaskAPIView.as_view(), name='delete-task'),
]
