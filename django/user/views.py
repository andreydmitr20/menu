
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import (PasswordChangeSerializer, RegistrationSerializer,
                          UserSerializer)


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request):
        try:
            return User.objects.get(pk=request.user.id)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, format=None):
        user = self.get_object(request)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def post(self, request):
        user = self.get_object(request)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistrationView(APIView):
    def post(self, request, format=None):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TestView(APIView):
    def get(self, request, format=None):
        return Response({"test": "ok"}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        logout(request)
        return Response({'msg': 'Successfully Logged out'}, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request, format=None):
        serializer = PasswordChangeSerializer(
            context={'request': request}, data=request.data)
        if serializer.is_valid():
            request.user.set_password(
                serializer.validated_data['new_password'])
            request.user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
