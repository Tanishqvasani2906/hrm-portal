from django.urls import path
from leavemanagement.views import LeaveManagementSerializerView, LeaveManagementSerializerForAdminView, UpdateLeaveStatusView

urlpatterns = [
    path('createLeave/', LeaveManagementSerializerView.as_view(), name='createLeave'),
    path('fetchLeaveForAdmin/', LeaveManagementSerializerForAdminView.as_view(), name='fetchLeave'),
    path('updateLeaveStatus/<int:leave_id>/', UpdateLeaveStatusView.as_view(), name='updateLeaveStatus'),
]