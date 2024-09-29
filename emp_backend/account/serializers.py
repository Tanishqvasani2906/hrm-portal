from rest_framework import serializers
from account.models import User
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.hashers import check_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings
from django.utils.html import strip_tags

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Enter a valid email address")
        return value

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2', None)
        return User.objects.create_user(**validated_data)

class UserLoginSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(max_length=255)
  class Meta:
    model = User
    fields = ['email', 'password']

class UserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['id', 'email', 'username', 'is_admin']

class UserChangePasswordSerializer(serializers.Serializer):
    currentpassword = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    newpassword = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    cnewpassword = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)

    class Meta:
        fields = ['currentpassword', 'newpassword', 'cnewpassword']
 
    def validate(self, attrs):
        user = self.context['user']
        current_password = attrs.get('currentpassword')
        new_password = attrs.get('newpassword')
        confirm_new_password = attrs.get('cnewpassword')

        if not user.check_password(current_password):
            raise serializers.ValidationError("Current password is not correct.")

        if new_password != confirm_new_password:
            raise serializers.ValidationError("New password and Confirm new password do not match.")

        return attrs

class SendPasswordResetEmailSerializer(serializers.Serializer):
  email = serializers.EmailField(max_length=255)
  class Meta:
    fields = ['email']

  def validate(self, attrs):
    email = attrs.get('email')
    if User.objects.filter(email=email).exists():
        user = User.objects.get(email=email)
        uid = urlsafe_base64_encode(force_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)
        reset_link = f'http://127.0.0.1:5173/resetPassword/{uid}/{token}'
        
        # Render email template
        context = {
            'reset_link': reset_link,
            'user': user,
        }
        html_message = render_to_string('ResetPassword.html', context)
        plain_message = strip_tags(html_message)
        
        subject = 'Reset Your Password'
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = user.email

        # Send email using Django's send_mail function
        send_mail(
            subject,
            plain_message,
            from_email,
            [to_email],
            html_message=html_message,
            fail_silently=False,
        )
        
        return attrs
    else:
        raise serializers.ValidationError("You are not a registered user")

class UserPasswordResetSerializer(serializers.Serializer):
  password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  class Meta:
    fields = ['password', 'password2']
    
  def validate(self, attrs):
    try:
      password = attrs.get('password')
      password2 = attrs.get('password2')
      uid = self.context.get('uid')
      token = self.context.get('token')
      if password != password2:
        raise serializers.ValidationError("Password and Confirm Password doesn't match")
      id = smart_str(urlsafe_base64_decode(uid))
      user = User.objects.get(id=id)
      if not PasswordResetTokenGenerator().check_token(user, token):
        raise serializers.ValidationError('Token is not Valid or Expired')
      user.set_password(password)
      user.save()
      return attrs
    except DjangoUnicodeDecodeError as identifier:
      PasswordResetTokenGenerator().check_token(user, token)
      raise serializers.ValidationError('Token is not Valid or Expired')

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()  