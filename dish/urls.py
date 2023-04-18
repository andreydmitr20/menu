from django.urls import path
from .views import UnitsView, TagsView, IngredientsView

app_name = 'dish'

urlpatterns = [
    path('dish/units/', UnitsView.as_view(), name='units'),
    path('dish/tags/', TagsView.as_view(), name='tags'),
    path('dish/ingredients/', IngredientsView.as_view(), name='ingredients'),

]
