""" All about user and auth"""
from django.db import models


class User(models.Model):
    """ user """
    name = models.CharField(max_length=200,
                            null=False,
                            blank=False,
                            unique=True)
    email = models.EmailField(blank=True)
    icon = models.CharField(max_length=400,
                            blank=True)
