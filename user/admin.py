""" admin """
from django.contrib import admin

from .models import User, Auth


class UserAdmin(admin.ModelAdmin):
    """ User admin"""
    list_display = ['id', 'name', 'contacts', 'icon']
    list_filter = ['name']
    search_fields = ['id', 'name', 'contacts']


admin.site.register(User, UserAdmin)


class AuthAdmin(admin.ModelAdmin):
    """ Auth admin"""
    list_display = ['id', 'user', 'login', 'password', 'jwt']
    list_filter = ['user', 'login']
    search_fields = ['id', 'user', 'login']


admin.site.register(Auth, AuthAdmin)
