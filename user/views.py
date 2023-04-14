from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import permissions
from rest_framework.views import APIView
from .models import User


class ViewUserProfile(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, format=None):
        profile = User.objects.filter(pk=request.user.id)
        token_user_icon = ''
        token_user_email = ''
        if profile.count() > 0:
            token_user_icon = profile.icon
            token_user_email = profile.email
        return JsonResponse({'token_user_id': request.user.id,
                             'token_user_username': request.user.username,
                             'token_user_icon': token_user_icon,
                             'token_user_email': token_user_email,
                             })
