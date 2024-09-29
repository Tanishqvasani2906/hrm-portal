from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from notice import models
from .models import Notice
from .serializers import NoticeSerializer
from django.utils import timezone
from django.db.models import Case, When


class NoticeListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        notices = Notice.objects.filter(end_date__gte=today)
        
        if notices:
            serializer = NoticeSerializer(notices, many=True)
            return Response(serializer.data)
        else:
            notices = []
            serializer = NoticeSerializer(notices, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = NoticeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Notice Successfully Created"}, status=status.HTTP_200_OK)
        
        errors = {"msg": "Failed to Create Notice", "errors": serializer.errors}
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        print(id)
        notice = Notice.objects.get(id=id)
        if notice is not None:
            notice.delete()
            return Response({'message': 'Notice deleted successfully.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Notice not found.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # 