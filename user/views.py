from django.shortcuts import render
from rest_framework import permissions
from rest_framework.views import APIView


class ViewUserProfile(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, format=None):
        token_user_email = request.user.email
        token_user_username = request.user.username
        token_user_icon = request.user.icon
        pass
