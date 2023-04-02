""" All about user and auth"""
from django.db import models


class User(models.Model):
    """ user """
    name = models.CharField(max_length=200,
                            null=False,
                            blank=False,
                            unique=True)
    contacts = models.CharField(max_length=400,
                                blank=True)
    icon = models.CharField(max_length=400,
                            blank=True)


class Auth(models.Model):
    """ data for authentication """

    user = models.ForeignKey(User,
                             null=False,
                             blank=False,
                             on_delete=models.CASCADE)
    login = models.CharField(max_length=50,
                             blank=False,
                             null=False,
                             unique=True)
    password = models.CharField(max_length=50,
                                blank=False,
                                null=False)
    jwt = models.CharField(max_length=400,
                           blank=True,
                           null=True,
                           unique=True)
