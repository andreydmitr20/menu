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

    choices = {0: ['ml', 'milliliters'],
               1: ['L', 'liters'],
               2: ['fl oz', 'fluid ounces'],
               3: ['tbsp', ' tablespoons'],
               4: ['tsp', 'teaspoons'],
               5: ['cup', 'cups'],
               6: ['g', 'grams'],
               7: ['kg', 'kilograms'],
               8: ['oz', 'ounces'],
               9: ['lb', 'pounds'],
               10: ['count', 'count units'],
               }
    id = models.IntegerField(
        primary_key=True, null=False, blank=False, unique=True)
    name = models.CharField(max_length=20,
                            null=False,
                            blank=False,
                            unique=True)
    description = models.CharField(max_length=30, null=True, blank=True)
    # value = models.FloatField(null=False,
    #                           blank=False)

    def __str__(self):
        return self.name+' '+self.description

    def fill(self):
        """ fill model with choices"""

        for key in self.choices.keys():
            unit = Unit(
                id=key, name=self.choices[key][0], description=self.choices[key][1])
            unit.save()


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
