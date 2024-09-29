from django.urls import path, include
from posts import views

urlpatterns = [
    path('Post/', views.PostApiView.as_view()),
]
