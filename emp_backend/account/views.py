from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.serializers import SendPasswordResetEmailSerializer, UserChangePasswordSerializer, UserLoginSerializer, UserPasswordResetSerializer, UserProfileSerializer, UserRegistrationSerializer, LogoutSerializer
from django.contrib.auth import authenticate
from account.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import smart_bytes
from django.contrib.auth import logout
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_decode
from django.utils.translation import gettext as _

# Generate Token Manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    # Add custom claims (add role here)
    refresh['is_admin'] = user.is_admin

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        uid = urlsafe_base64_encode(smart_bytes(user.id))
        token = default_token_generator.make_token(user)
        
        verification_link = f'http://127.0.0.1:5173/verifyEmail/{uid}/{token}'
        
        context = {
            'verification_link': verification_link,
            'user': user,
        }
        
        html_message = render_to_string('VerifyEmail.html', context)
        plain_message = strip_tags(html_message)
        
        subject = 'Verify Your Email'
        from_email = settings.EMAIL_HOST_USER
        to_email = user.email

        send_mail(
            subject,
            plain_message,
            from_email,
            [to_email],
            html_message=html_message,
        )
        
        return Response({'msg': 'Registration successful. Please check your email for verification.'}, status=status.HTTP_201_CREATED)
    
class VerifyEmailView(APIView):
    def get(self, request, uidb64, token, format=None):
        try:
            user_id = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(id=user_id)

            if default_token_generator.check_token(user, token):
                if not user.is_active:
                    user.is_active = True
                    user.save()
                    return Response({'msg': 'Email verified successfully'}, status=status.HTTP_200_OK)
                else:
                    return Response({'msg': 'Email already verified'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'msg': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({'msg': 'Invalid link or user does not exist'}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    renderer_classes = [UserRenderer]

    ALLOWED_PUBLIC_IP = '127.0.0.0'

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(email=email, password=password)
        # user_ip = request.META.get('REMOTE_ADDR')
        
        if user is not None:
            # if user_ip == self.ALLOWED_PUBLIC_IP:
            #     today = timezone.now().date()
                
            #     if not Attendance.objects.filter(user=user, created_date__date=today).exists():
            #         Attendance.objects.create(user=user, is_present=True, created_date=timezone.now())

            token = get_tokens_for_user(user)
            return Response({'token': token, 'msg': 'Login Success'}, status=status.HTTP_200_OK)
        else:
            return Response({'errors': {'non_field_errors': ['Email or Password is not Valid']}}, status=status.HTTP_404_NOT_FOUND)


class UserProfileView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def get(self, request, format=None):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user': request.user})
        if serializer.is_valid(raise_exception=True):
            new_password = serializer.validated_data.get('newpassword')
            request.user.set_password(new_password)
            request.user.save()
            return Response({'msg': 'Password changed successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SendPasswordResetEmailView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = SendPasswordResetEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, uid, token, format=None):
    serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    renderer_classes = [UserRenderer]
    
    def post(self, request, format=None):
        serializer = LogoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        refresh_token = serializer.validated_data.get('refresh')
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            logout(request)
            return Response({'message': 'Logout successful.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'exception': str(e)}, status=status.HTTP_400_BAD_REQUEST)




