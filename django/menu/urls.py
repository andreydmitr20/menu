
from rest_framework.authentication import BasicAuthentication
from rest_framework.schemas import get_schema_view
from rest_framework.urlpatterns import format_suffix_patterns

from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),

    path('__debug__/', include('debug_toolbar.urls')),

    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    path('api/', get_schema_view(
        title="Menu",
        description="API",
        version="1.0.0",
        authentication_classes=(BasicAuthentication,),
        public=True,  # True to allow view all api
    ), name='openapi-schema'),

    path('swagger-ui/', TemplateView.as_view(
        template_name='swagger-ui.html',
        extra_context={'schema_url': 'openapi-schema'}
    ), name='swagger-ui'),

    path('api/user/', include('user.urls', namespace='user')),
    path('api/dish/', include('dish.urls', namespace='dish')),

]

urlpatterns = format_suffix_patterns(urlpatterns)
