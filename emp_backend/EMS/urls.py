from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/user/', include('account.urls')),
    path('attendance/', include('attendance.urls')),
    path('leavemanagement/', include('leavemanagement.urls')),
    path('salaryslip/', include('salaryslip.urls')),
    path('employee/', include('employee.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('notice/', include('notice.urls')),
]