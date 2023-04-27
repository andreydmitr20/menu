from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from .views import ChangePasswordView, LogoutView, RegistrationView, UserView, TestView

app_name = 'user'

urlpatterns = [
    path('test/', TestView.as_view(), name='test'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/', RegistrationView.as_view(), name='user_register'),
    path('logout/', LogoutView.as_view(), name='user_logout'),
    path('change-password/',
         ChangePasswordView.as_view(), name='user_change_password'),

    path('', UserView.as_view(), name='user_info'),

]
