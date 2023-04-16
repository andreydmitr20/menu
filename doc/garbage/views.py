from django.contrib.auth.models import User as UserDjango
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseServerError
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


class ViewUserRegister(APIView):
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, format=None):
        print(request.username)
        user = UserDjango.objects.filter(username=request.username)
        if user.count() > 0:
            # same name user exists
            return HttpResponseBadRequest({'Same name user exists'})
        try:
            userDjango = UserDjango(username=request.username,
                                    password=request.password)
            userDjango.save()
            user = User(id=userDjango.id, email=request.email,
                        icon=request.icon)
            user.save()
        except:
            return HttpResponseServerError({'Error creating new user'})

        return JsonResponse({'token_user_id': user.id,
                             'token_user_username': userDjango.username,
                             'token_user_icon': user.icon,
                             'token_user_email': user.email,
                             })
