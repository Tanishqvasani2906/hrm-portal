from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.renderers import UserRenderer
from rest_framework.permissions import IsAuthenticated
from account.views import get_tokens_for_user
from leavemanagement.models import LeaveManagement
from leavemanagement.serializers import LeaveFetchSerializer, LeaveManagementSerializer, AdminLeaveFetchSerializer, LeaveStatusUpdateSerializer

# Create your views here.

class LeaveManagementSerializerView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        serializer = LeaveManagementSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg': 'Leave created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'msg': 'There is something wrong for creating your Leave'}, status=status.HTTP_404_NOT_FOUND)
        
    def get(self, request, format=None):
        user = request.user
        leave = LeaveManagement.objects.filter(emp_details__user=user)
        serializer = LeaveFetchSerializer(leave, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class LeaveManagementSerializerForAdminView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            leave = LeaveManagement.objects.all()
            serializer = AdminLeaveFetchSerializer(leave, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class UpdateLeaveStatusView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def put(self, request, leave_id, format=None):  # Use leave_no instead of leave_id
        try:
            # Retrieve the leave request by leave_no (primary key)
            leave_request = LeaveManagement.objects.get(pk=leave_id)
        except LeaveManagement.DoesNotExist:
            return Response({'detail': 'Leave request not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if the user is an admin
        if not request.user.is_admin:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        # Update the leave request with the new status
        serializer = LeaveStatusUpdateSerializer(leave_request, data=request.data, partial=True)
        
        if serializer.is_valid():
            try:
                serializer.save()  # Save the updated leave status
                return Response({'detail': 'Leave status updated successfully.'}, status=status.HTTP_200_OK)
            except Exception as e:
                print(f"Error during saving: {e}")  # Capture any errors that occur during save
                return Response({'detail': 'Error during saving.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(f"Serializer errors: {serializer.errors}")  # Debugging statement for validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


