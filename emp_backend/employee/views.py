from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from account.models import User
from .models import EmployeeDetails
from .serializers import EmployeeDetailSerializer, EmployeeDetailsSerializer
from django.shortcuts import get_object_or_404

class EmployeeDetailsListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        employees = EmployeeDetails.objects.all()
        serializer = EmployeeDetailSerializer(employees, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EmployeeDetailSerializer(data=request.data)

        if serializer.is_valid():
            working_emailid = serializer.validated_data['working_emailid']
            try:
                user = User.objects.get(email=working_emailid)
            except User.DoesNotExist:
                return Response({"error": "No user is registered with this email."}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save(user=user)
            return Response({"message": "Employee added successfully"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, emp_id):
        try:
            employee = EmployeeDetails.objects.get(emp_id=emp_id)
        except EmployeeDetails.DoesNotExist:
            return Response({"error": "Employee details not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = EmployeeDetailSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FetchEmployeeByIdView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, emp_id, format=None):
        # Fetch employee details by 4-digit emp_id
        if len(emp_id) == 4:
            employee_details = get_object_or_404(EmployeeDetails, emp_id=emp_id)
            serializer = EmployeeDetailsSerializer(employee_details)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid employee ID."}, status=status.HTTP_400_BAD_REQUEST)
