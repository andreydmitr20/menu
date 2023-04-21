
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("api/admin/", admin.site.urls),

    path('api/__debug__/', include('debug_toolbar.urls')),

    path('api/api-auth/', include('rest_framework.urls', namespace='rest_framework')),


    path('api/', include('user.urls', namespace='user')),
    path('api/', include('dish.urls', namespace='dish')),

]
