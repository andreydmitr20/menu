from rest_framework import serializers
from .models import Vitamin, Unit, Tag, Ingredient


class VitaminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vitamin
        fields = '__all__'


class VitaminShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vitamin
        fields = ['id', 'name']


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'


class UnitShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['id', 'name']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class TagShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class IngredientSerializer(serializers.ModelSerializer):
    creator = serializers.CharField(
        source='user.username')  # , allow_null = True)

    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'photo', 'creator', 'proteins',
                  'fats', 'carbohydrates', 'vitamins']
