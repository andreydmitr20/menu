
from re import search

from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import Http404, HttpResponse
from django.shortcuts import render

from .models import Dish, Ingredient, Tag, Unit, Vitamin
from .serializers import (DishSerializer, DishShortSerializer,
                          IngredientSerializer, IngredientShortSerializer,
                          TagSerializer, TagShortSerializer, UnitSerializer,
                          UnitShortSerializer, VitaminSerializer,
                          VitaminShortSerializer)

USER_IS_NOT_AUTHORIZED_TO_DELETE = 'User is not authorized to delete'
ERROR_WHILE_DELETING = 'Error while deleting'


class VitaminsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VitaminSerializer

    def get(self, format=None):

        serializer_class_local = (VitaminSerializer
                                  if (self.request.query_params.get('short') != '1')
                                  else VitaminShortSerializer)

        fields = serializer_class_local.Meta.fields

        queryset = (Vitamin.objects.all()
                    if (type(fields) is str)
                    else Vitamin.objects.values(*fields)).order_by('name')

        serializer = serializer_class_local(queryset, many=True)
        return Response(serializer.data)


class UnitsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UnitSerializer

    def get(self, format=None):
        serializer_class_local = (UnitSerializer
                                  if (self.request.query_params.get('short') != '1')
                                  else UnitShortSerializer)

        fields = serializer_class_local.Meta.fields

        queryset = (Unit.objects.all()
                    if (type(fields) is str)
                    else Unit.objects.values(*fields)).order_by('name')

        serializer = serializer_class_local(queryset, many=True)
        return Response(serializer.data)


class TagsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TagSerializer

    def get(self, format=None):
        serializer_class_local = (TagSerializer
                                  if (self.request.query_params.get('short') != '1')
                                  else TagShortSerializer)

        fields = serializer_class_local.Meta.fields

        queryset = (Tag.objects.all()
                    if (type(fields) is str)
                    else Tag.objects.values(*fields)).order_by('id')

        serializer = serializer_class_local(queryset, many=True)
        return Response(serializer.data)


def parseSearchToQueryset(queryset,
                          search_text: str,
                          order_by=None):
    search_text = search_text.strip()
    if (search_text != ''):
        search_text = search_text.split(' ')
    search_text_len = len(search_text)
    if search_text_len > 0:
        if search_text_len == 1:
            queryset = queryset.filter(
                Q(
                    name__icontains=search_text[0].strip()
                ))
        elif (search_text_len == 2):
            queryset = queryset.filter(
                Q(
                    name__icontains=search_text[0].strip()
                ) | Q(
                    name__icontains=search_text[1].strip()
                ))
        else:
            queryset = queryset.filter(
                Q(
                    name__icontains=search_text[0].strip()
                ) | Q(
                    name__icontains=search_text[1].strip()
                ) | Q(
                    name__icontains=search_text[2].strip()
                ))
    if order_by != None:
        queryset = queryset.order_by(order_by)
    return queryset


class IngredientsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = IngredientSerializer

    def get_object(self, ingredient_id):
        try:
            return Ingredient.objects.get(pk=ingredient_id)
        except Ingredient.DoesNotExist:
            raise Http404

    def get(self, request, ingredient_id=None, format=None):
        if ingredient_id != None:
            ingredient = self.get_object(ingredient_id)
            serializer = self.serializer_class(ingredient)
            return Response(serializer.data)

        serializer_class_local = (IngredientSerializer
                                  if (self.request.query_params.get('short') != '1')
                                  else IngredientShortSerializer)

        fields = serializer_class_local.Meta.fields
        queryset = (Ingredient.objects.all()
                    if (type(fields) is str)
                    else Ingredient.objects
                    # inner join
                    .select_related('user')
                    .values(*fields))

        if (self.request.query_params.get('mine') == "1"):
            queryset = queryset.filter(user=self.request.user.id)

        queryset = parseSearchToQueryset(
            queryset,
            self.request.query_params.get('search'),
            'name')

        # print(queryset.query)

        page_number = self.request.query_params.get('page_number', 1)
        page_size = self.request.query_params.get('page_size', 10)
        paginator = Paginator(queryset, page_size)
        serializer = serializer_class_local(paginator.page(
            page_number), many=True, context={'request': self.request})
        response = Response(serializer.data, status=status.HTTP_200_OK)
        return response

    def post(self, request, ingredient_id=None, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, ingredient_id=None, format=None):
        ingredient = self.get_object(ingredient_id)
        # check if the same user
        if ingredient.user_id != request.user.id:
            return Response(USER_IS_NOT_AUTHORIZED_TO_DELETE, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.serializer_class(ingredient, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, ingredient_id=None, format=None):
        ingredient = self.get_object(ingredient_id)
        # check if the same user
        if ingredient.user_id != request.user.id:
            return Response(USER_IS_NOT_AUTHORIZED_TO_DELETE, status=status.HTTP_400_BAD_REQUEST)
        try:
            ingredient.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(ERROR_WHILE_DELETING, status=status.HTTP_400_BAD_REQUEST)


class DishesView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DishSerializer

    def get_object(self, dish_id):
        try:
            return Dish.objects.get(pk=dish_id)
        except Dish.DoesNotExist:
            raise Http404

    def get(self, request, dish_id=None, format=None):
        if dish_id != None:
            dish = self.get_object(dish_id)
            serializer = self.serializer_class(dish)
            return Response(serializer.data)

        serializer_class_local = (DishSerializer
                                  if (self.request.query_params.get('short') != '1')
                                  else DishShortSerializer)

        fields = serializer_class_local.Meta.fields
        queryset = (Dish.objects.all()
                    if (type(fields) is str)
                    else Dish.objects
                    # inner join
                    .select_related('user')
                    .values(*fields))

        if (self.request.query_params.get('mine') == "1"):
            queryset = queryset.filter(user=self.request.user.id)

        queryset = parseSearchToQueryset(
            queryset,
            self.request.query_params.get('search'),
            'name')

        # print(queryset.query)

        page_number = self.request.query_params.get('page_number', 1)
        page_size = self.request.query_params.get('page_size', 10)
        paginator = Paginator(queryset, page_size)
        serializer = serializer_class_local(paginator.page(
            page_number), many=True, context={'request': self.request})
        response = Response(serializer.data, status=status.HTTP_200_OK)
        return response
