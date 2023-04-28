""" admin """
from django.contrib import admin

from .models import Dish, Unit, Ingredient, Tag, Vitamin, Composition


class DishAdmin(admin.ModelAdmin):
    """ Dish admin"""
    list_display = ['name', 'photo', 'receipt', 'user', 'created']
    list_filter = ['name', 'user']
    search_fields = ['name', 'user', 'receipt']


admin.site.register(Dish, DishAdmin)


class VitaminAdmin(admin.ModelAdmin):
    """ Vitamin admin
    ENTERED BY ADMIN
    """
    list_display = ['id', 'name', 'description']
    search_fields = ['id', 'name', 'description']


admin.site.register(Vitamin, VitaminAdmin)


class UnitAdmin(admin.ModelAdmin):
    """ Unit admin
    ENTERED BY ADMIN
    """
    list_display = ['id', 'name', 'description']
    search_fields = ['id', 'name', 'description']


admin.site.register(Unit, UnitAdmin)


class IngredientAdmin(admin.ModelAdmin):
    """ Ingredient admin"""
    list_display = ['name', 'photo', 'proteins',
                    'fats', 'carbohydrates', 'vitamins', 'user']
    list_filter = ['name', 'user']
    search_fields = ['name']
    # search_fields = ['id', 'name', 'user']


admin.site.register(Ingredient, IngredientAdmin)


# class CompositionAdmin(admin.ModelAdmin):
#     """ Composition admin"""
#     list_display = ['dish', 'ingredient', 'amount', 'unit']
#     list_filter = ['dish', 'ingredient', 'unit']
#     search_fields = ['dish', 'ingredient', 'unit']


# admin.site.register(Composition, CompositionAdmin)


class TagAdmin(admin.ModelAdmin):
    """ Tag admin
    ENTERED BY ADMIN
    """
    list_display = ['id', 'name', 'description']
    list_filter = ['description']
    search_fields = ['id', 'name', 'description']


admin.site.register(Tag, TagAdmin)
