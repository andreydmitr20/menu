from rest_framework import serializers
from .models import Unit, Tag, Ingredient


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class IngredientSerializer(serializers.ModelSerializer):
    creator = serializers.CharField(
        source='user.username')  # , allow_null = True)

    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'photo', 'creator', 'protein',
                  'fat', 'carbohydrates', 'vitamins']
