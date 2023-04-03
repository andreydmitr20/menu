""" admin """
from django.contrib import admin

from .models import Calendar, Like, Marking


class CalendarAdmin(admin.ModelAdmin):
    """ Calendar admin"""
    list_display = ['date', 'user', 'dish', 'amount']
    list_filter = ['user', 'dish']
    search_fields = ['date', 'user', 'dish']


admin.site.register(Calendar, CalendarAdmin)


class LikeAdmin(admin.ModelAdmin):
    """ Like admin"""
    list_display = ['user', 'dish']
    list_filter = ['user', 'dish']
    search_fields = ['user', 'dish']


admin.site.register(Like, LikeAdmin)


class MarkingAdmin(admin.ModelAdmin):
    """ Marking admin"""
    list_display = ['user', 'dish', 'tag', 'value']
    list_filter = ['user', 'dish', 'tag']
    search_fields = ['user', 'dish', 'tag']


admin.site.register(Marking, MarkingAdmin)
