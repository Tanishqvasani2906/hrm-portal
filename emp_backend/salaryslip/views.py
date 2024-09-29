from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from rest_framework.permissions import IsAuthenticated

from employee.models import EmployeeDetails
from .models import SalarySlip
from .serializers import SalarySlipSerializer, SalarySlipViewSerializer
from account.renderers import UserRenderer

class SalarySlipCreateView(APIView):
    serializer_class = SalarySlipSerializer
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Get the request data and serialize it
        serializer = SalarySlipSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# View to list SalarySlips
class SalarySlipListView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get the email from the request body
        email = request.data.get('email')

        # Check if email is provided
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Try to get the employee by email
        try:
            employee = EmployeeDetails.objects.get(working_emailid=email)
        except EmployeeDetails.DoesNotExist:
            return Response({"error": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)

        # Filter SalarySlip objects by the employee
        queryset = SalarySlip.objects.filter(employee=employee)

        # Serialize the filtered queryset
        serializer = SalarySlipViewSerializer(queryset, many=True)

        # Return the serialized data as the response
        return Response(serializer.data, status=status.HTTP_200_OK)
