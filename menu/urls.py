
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),

    path('__debug__/', include('debug_toolbar.urls')),

    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),


    path('', include('user.urls', namespace='user')),
    path('', include('dish.urls', namespace='dish')),

]
