from django.urls import path
# IngredientsView,
from .views import (VitaminsView, UnitsView,
                    TagsView,
                    IngredientsView, DishesView)

app_name = 'dish'

urlpatterns = [
    path('vitamins/', VitaminsView.as_view(), name='vitamins'),
    path('units/', UnitsView.as_view(), name='units'),
    path('tags/', TagsView.as_view(), name='tags'),

    path('ingredients/', IngredientsView.as_view(), name='ingredients'),
    path('ingredients/<int:ingredient_id>',
         IngredientsView.as_view(), name='ingredients'),

    path('dishes/', DishesView.as_view(), name='dishes'),
    path('dishes/<int:dish_id>',
         DishesView.as_view(), name='dishes'),

]
