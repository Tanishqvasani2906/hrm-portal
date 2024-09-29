from django.urls import path
from .views import (
    EmployeeDetailsListView,
    FetchEmployeeByIdView
)

urlpatterns = [
    path('addEmployee/', EmployeeDetailsListView.as_view(), name='add-employee'),
    path('fetchAllEmployees/', EmployeeDetailsListView.as_view(), name='fetch-all-employees'),
    path('updateEmployee/<str:emp_id>/', EmployeeDetailsListView.as_view(), name='update-employees'),
    path('fetchEmployee/<str:emp_id>/', FetchEmployeeByIdView.as_view(), name='fetch-employee-by-id'),
]
