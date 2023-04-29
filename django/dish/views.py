
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import Http404, HttpResponse
from django.shortcuts import render
from rest_framework import status, viewsets
from django.core.paginator import Paginator
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ingredient, Tag, Unit, Vitamin
from .serializers import (IngredientSerializer,
                          TagSerializer, TagShortSerializer,
                          UnitSerializer, UnitShortSerializer,
                          VitaminSerializer, VitaminShortSerializer)


class VitaminsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VitaminSerializer

    def get(self, format=None):

        serializerClass = (VitaminSerializer
                           if (self.request.query_params.get('short') != '1')
                           else VitaminShortSerializer)

        fields = serializerClass.Meta.fields

        queryset = (Vitamin.objects.all()
                    if (type(fields) is str)
                    else Vitamin.objects.all().values(*fields)).order_by('name')

        serializer = serializerClass(queryset, many=True)
        return Response(serializer.data)


class UnitsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UnitSerializer

    def get(self, format=None):
        serializerClass = (UnitSerializer
                           if (self.request.query_params.get('short') != '1')
                           else UnitShortSerializer)

        fields = serializerClass.Meta.fields

        queryset = (Unit.objects.all()
                    if (type(fields) is str)
                    else Unit.objects.all().values(*fields)).order_by('name')

        serializer = serializerClass(queryset, many=True)
        return Response(serializer.data)


class TagsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TagSerializer

    def get(self, format=None):
        serializerClass = (TagSerializer
                           if (self.request.query_params.get('short') != '1')
                           else TagShortSerializer)

        fields = serializerClass.Meta.fields

        queryset = (Tag.objects.all()
                    if (type(fields) is str)
                    else Tag.objects.all().values(*fields)).order_by('id')

        serializer = serializerClass(queryset, many=True)
        return Response(serializer.data)


class IngredientsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = IngredientSerializer

    # def get_object(self, request):
    #     try:
    #         return Ingredient.objects.get(pk=request.ingredient.id)
    #     except Ingredient.DoesNotExist:
    #         raise Http404

    def get(self, format=None):
        search_text = self.request.query_params.get('search')
        search_text = search_text.strip().split(' ')
        search_text_len = len(search_text)
        if (search_text_len == 0):
            queryset = Ingredient.objects.all().order_by('name')
        elif (search_text_len == 1):
            queryset = Ingredient.objects.filter(
                Q(
                    name__icontains=search_text[0].strip()
                )).order_by('name')
        elif (search_text_len == 2):
            queryset = Ingredient.objects.filter(
                Q(
                    name__icontains=search_text[0].strip()
                ) | Q(
                    name__icontains=search_text[1].strip()
                )).order_by('name')
        else:
            queryset = Ingredient.objects.filter(
                Q(
                    name__icontains=search_text[0].strip()
                ) | Q(
                    name__icontains=search_text[1].strip()
                ) | Q(
                    name__icontains=search_text[2].strip()
                )).order_by('name')

        page_number = self.request.query_params.get('page_number', 1)
        page_size = self.request.query_params.get('page_size', 10)
        paginator = Paginator(queryset, page_size)
        serializer = self.serializer_class(paginator.page(
            page_number), many=True, context={'request': self.request})

        response = Response(serializer.data, status=status.HTTP_200_OK)
        return response

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        print(request.user.id, request.data.user_id)
        if request.user.id == request.data.user_id and serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
