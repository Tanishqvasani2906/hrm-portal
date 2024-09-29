from django.urls import path
from .views import SalarySlipCreateView, SalarySlipListView

urlpatterns = [
    path('generateSalarySlip/', SalarySlipCreateView.as_view(), name='generateSalarySlip'),
     path('salarySlips/', SalarySlipListView.as_view(), name='salary-slip-list'),
]