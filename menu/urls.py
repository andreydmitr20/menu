
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)
from user.views import ViewUserProfile, ViewUserRegister

urlpatterns = [
    path("admin/", admin.site.urls),
    path('__debug__/', include('debug_toolbar.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/user/profile/', ViewUserProfile.as_view(), name='view_user_profile'),
    path('api/user/register/', ViewUserRegister.as_view(),
         name='view_user_register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


]
