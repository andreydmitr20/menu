from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from .views import ChangePasswordView, LogoutView, RegistrationView, UserView, TestView

app_name = 'user'

urlpatterns = [
    path('user/test/', TestView.as_view(), name='test'),

    path('user/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('user/register/', RegistrationView.as_view(), name='user_register'),
    path('user/logout/', LogoutView.as_view(), name='user_logout'),
    path('user/change-password/',
         ChangePasswordView.as_view(), name='user_change_password'),

    path('user/', UserView.as_view(), name='user_info'),

]
