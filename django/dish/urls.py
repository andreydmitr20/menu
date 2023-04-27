from django.urls import path
from .views import VitaminsView, UnitsView, TagsView, IngredientsView

app_name = 'dish'

urlpatterns = [
    path('vitamins/', VitaminsView.as_view(), name='vitamins'),
    path('units/', UnitsView.as_view(), name='units'),
    path('tags/', TagsView.as_view(), name='tags'),
    path('ingredients/', IngredientsView.as_view(), name='ingredients'),

]
