
from drf_spectacular.views import (SpectacularAPIView, SpectacularRedocView,
                                   SpectacularSwaggerView)
from rest_framework.authentication import BasicAuthentication

from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

urlpatterns = [
    path("api/admin/", admin.site.urls),

    path('api/__debug__/', include('debug_toolbar.urls')),

    path('api/api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/',
         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/',
         SpectacularRedocView.as_view(url_name='schema'), name='redoc'),


    path('api/user/', include('user.urls', namespace='user')),
    path('api/dish/', include('dish.urls', namespace='dish')),

]

# urlpatterns = format_suffix_patterns(urlpatterns)
