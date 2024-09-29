from django.urls import path
from .views import NoticeListCreateView

urlpatterns = [
    path('notices/', NoticeListCreateView.as_view(), name='notice-list-create'),
    path('notices/<uuid:id>/', NoticeListCreateView.as_view(), name='notice-delete'),
]