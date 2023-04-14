""" admin """
from django.contrib import admin

from .models import User


class UserAdmin(admin.ModelAdmin):
    """ User admin"""
    list_display = ['id', 'name', 'email', 'icon']
    list_filter = ['name']
    search_fields = ['id', 'name', 'email']


admin.site.register(User, UserAdmin)
