""" admin """
from django.contrib import admin

from .models import Dish, Unit, Ingredient, Tag, Composition


class DishAdmin(admin.ModelAdmin):
    """ Dish admin"""
    list_display = ['name', 'photo', 'receipt', 'user']
    list_filter = ['name', 'user']
    search_fields = ['name', 'user', 'receipt']


admin.site.register(Dish, DishAdmin)


class UnitAdmin(admin.ModelAdmin):
    """ Unit admin
    ENTERED BY ADMIN
    """
    list_display = ['name', 'value']
    list_filter = ['name', 'value']
    search_fields = ['name']


admin.site.register(Unit, UnitAdmin)


class IngredientAdmin(admin.ModelAdmin):
    """ Ingredient admin"""
    list_display = ['name', 'photo', 'protein',
                    'fat', 'carbohydrates', 'vitamins', 'user']
    list_filter = ['name', 'user']
    search_fields = ['name', 'user']


admin.site.register(Ingredient, IngredientAdmin)


class CompositionAdmin(admin.ModelAdmin):
    """ Composition admin"""
    list_display = ['dish', 'ingredient', 'amount', 'unit']
    list_filter = ['dish', 'ingredient', 'unit']
    search_fields = ['dish', 'ingredient', 'unit']


admin.site.register(Composition, CompositionAdmin)


class TagAdmin(admin.ModelAdmin):
    """ Tag admin
    ENTERED BY ADMIN
    """
    list_display = ['name']
    list_filter = ['name']
    search_fields = ['name']


admin.site.register(Tag, TagAdmin)
