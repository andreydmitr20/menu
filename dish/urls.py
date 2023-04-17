from django.urls import path
from .views import UnitView, TagView

app_name = 'dish'

urlpatterns = [
    path('dish/units/', UnitView.as_view(), name='units'),
    path('dish/tags/', TagView.as_view(), name='tags'),
    # path('dish/', DishView.as_view(), name='dish'),

]
