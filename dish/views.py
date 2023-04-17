
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Unit, Tag
from .serializers import (UnitSerializer, TagSerializer)


class UnitView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, format=None):
        queryset = Unit.objects.all().order_by('name')
        # print(queryset)
        serializer = UnitSerializer(queryset, many=True)
        return Response(serializer.data)


class TagView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, format=None):
        queryset = Tag.objects.all().order_by('id')
        # print(queryset)
        serializer = TagSerializer(queryset, many=True)
        return Response(serializer.data)
