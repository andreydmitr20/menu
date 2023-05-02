from pkg_resources import require
from rest_framework import serializers
from .models import Vitamin, Unit, Tag, Ingredient, Dish


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


def checkVitamins(value):
    # TODO
    print(value)
    return True


checkVitaminsError = "Vitamins have wrong data"


class IngredientSerializer(serializers.ModelSerializer):
    creator = serializers.CharField(
        source='user.username', required=False)  # , allow_null = True)

    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'photo', 'creator', 'user', 'proteins',
                  'fats', 'carbohydrates', 'vitamins', 'created']

    def validate_vitamins(self, value):
        if not checkVitamins(value):
            raise serializers.ValidationError([checkVitaminsError])
        return value


class IngredientShortSerializer(serializers.ModelSerializer):
    # to make fields from another table valid
    user__id = serializers.CharField()
    user__username = serializers.CharField()

    class Meta:
        model = Ingredient
        fields = ('id', 'name', 'photo', 'user__id', 'user__username')
        # to avoid validation for fields from another table
        read_only_fields = ('user__id', 'user__username')


class DishSerializer(serializers.ModelSerializer):
    user__id = serializers.CharField()
    user__username = serializers.CharField()

    class Meta:
        model = Dish
        fields = ('id', 'name', 'photo',  'receipt',
                  'created', 'user__username', 'user__id',)
        read_only_fields = ('user__id', 'user__username')


class DishShortSerializer(serializers.ModelSerializer):
    user__id = serializers.CharField()
    user__username = serializers.CharField()

    class Meta:
        model = Dish
        fields = ['id', 'name', 'photo',  'user__username', 'user__id']
        read_only_fields = ('user__id', 'user__username')
