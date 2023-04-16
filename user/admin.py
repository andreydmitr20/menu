""" admin """
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


class UserAdmin(BaseUserAdmin):

    list_display = ('username', 'email', 'icon', 'is_admin')
    list_filter = ('is_admin',)

    fieldsets = (
        (None, {'fields': ('username', 'email', 'icon', 'password')}),

        ('Permissions', {'fields': ('is_admin',)}),
    )

    search_fields = ('username', 'email', 'icon')
    ordering = ('username', 'email')

    filter_horizontal = ()


admin.site.register(User, UserAdmin)


admin.site.unregister(Group)
