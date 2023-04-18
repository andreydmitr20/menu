
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import Http404, HttpResponse
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ingredient, Tag, Unit
from .serializers import IngredientSerializer, TagSerializer, UnitSerializer


class UnitsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, format=None):
        queryset = Unit.objects.all().order_by('name')
        serializer = UnitSerializer(queryset, many=True)
        return Response(serializer.data)


class TagsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, format=None):
        queryset = Tag.objects.all().order_by('id')
        serializer = TagSerializer(queryset, many=True)
        return Response(serializer.data)


class IngredientsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, format=None):
        search_text = self.request.query_params.get('search')
        search_text = search_text.split(' ')
        print('search:', search_text)

        queryset = Ingredient.objects.filter(

            Q(name__icontains=search_text)

        ).order_by('name')

        # queryset = Ingredient.objects.all().order_by('id')
        print(queryset)
        serializer = IngredientSerializer(queryset, many=True)
        return Response(serializer.data)
