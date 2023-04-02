""" All about dishes and ingredients"""
from django.db import models
from user.models import User


class Dish(models.Model):
    """ dishes """
    name = models.CharField(max_length=200,
                            null=False,
                            blank=False,
                            unique=True)
    photo = models.CharField(max_length=400,
                             null=False,
                             blank=False)
    receipt = models.CharField(max_length=2048,
                               blank=True)
    user = models.ForeignKey(User,
                             null=False,
                             blank=False,
                             on_delete=models.DO_NOTHING)


class Unit(models.Model):
    """ units """
    name = models.CharField(max_length=20,
                            null=False,
                            blank=False,
                            unique=True)
    value = models.FloatField(null=False,
                              blank=False)


class Ingredient(models.Model):
    """ ingredients """
    name = models.CharField(max_length=200,
                            null=False,
                            blank=False,
                            unique=True)
    photo = models.CharField(max_length=400,
                             null=False,
                             blank=False)

    protein = models.FloatField(null=True,
                                blank=True)
    fat = models.FloatField(null=True,
                            blank=True)
    carbohydrates = models.FloatField(null=True,
                                      blank=True)
    vitamins = models.JSONField(null=True,
                                blank=True)

    user = models.ForeignKey(User,
                             null=False,
                             blank=False,
                             on_delete=models.DO_NOTHING)


class Composition(models.Model):
    """ compositions """
    dish = models.ForeignKey(Dish,
                             null=False,
                             blank=False,
                             on_delete=models.DO_NOTHING)
    ingredient = models.ForeignKey(Ingredient,
                                   null=False,
                                   blank=False,
                                   on_delete=models.DO_NOTHING)
    amount = models.FloatField(null=False,
                               blank=False)

    unit = models.ForeignKey(Unit,
                             null=False,
                             blank=False,
                             on_delete=models.DO_NOTHING)


class Tag(models.Model):
    """ tags """
    name = models.CharField(max_length=200,
                            null=False,
                            blank=False,
                            unique=True)
