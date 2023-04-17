""" All about dishes and ingredients"""
from django.db import models
from user.models import User


class Unit(models.Model):
    """ units """

    choices = {0: ['ml', 'milliliters'],
               1: ['L', 'liters'],
               2: ['fl oz', 'fluid ounces'],
               3: ['tbsp', 'tablespoons'],
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
    description = models.CharField(
        max_length=30, null=True, blank=True, default='')

    def __str__(self):
        return self.name+' '+self.description

    def fill(self):
        """ fill model with choices"""

        for key, value in self.choices.items():
            unit = Unit(
                id=key, name=value[0], description=value[1])
            unit.save()


class Tag(models.Model):
    """ tags """
    tags_group = 'tags group'

    choices = {
        # by time
        0: ['By time', tags_group],
        1: ['Breakfast', 'The first meal of the day, typically eaten in the morning'],
        2: ['Brunch', 'A combination of breakfast and lunch, typically eaten in the late morning to early afternoon'],
        3: ['Lunch', 'A midday meal, typically eaten around noon or early afternoon'],
        4: ['Tea time', 'A late afternoon or early evening break for tea and light snacks'],
        5: ['Dinner', 'The main evening meal, typically eaten between 6 pm and 9 pm'],
        6: ['Supper', 'A late evening meal, typically eaten after dinner or before bedtime'],
        7: ['Snack time', 'A time for small, quick bites between meals, typically mid-morning or mid-afternoon'],



        # by products
        100: ['By availability', tags_group],
        101: ['From existing products', 'all meals you can cook from existing products'],


        # by groups
        200: ['By groups', tags_group],
        201: ['Appetizers', 'Small dishes served before a meal to stimulate the appetite. Examples include bruschetta, spring rolls, and hummus'],
        202: ['Soups', 'Liquid dishes made by simmering ingredients in a liquid base. Examples include chicken noodle soup, tomato soup, and miso soup'],
        203: ['Salads', 'Dishes made from a combination of raw or cooked ingredients, typically with a dressing. Examples include Caesar salad, Greek salad, and fruit salad'],
        204: ['Entrees/Main courses', 'The main dishes of a meal, often consisting of a protein and accompanying sides. Examples include steak, pasta dishes, and stir-fry'],
        205: ['Desserts', 'Smaller dishes that accompany the main dish, often consisting of vegetables or grains. Examples include mashed potatoes, steamed broccoli, and rice pilaf'],
        206: ['Sides', 'Sweet dishes served at the end of a meal. Examples include cakes, pies, and ice cream'],
        207: ['Beverages', 'Drinks served with or without meals. Examples include water, soda, juice, tea, and coffee'],

        # by nutrients
        300: ['By nutrients', tags_group],
        301: ['High proteins', 'Dishes with high amount of proteins'],
        302: ['High carbohydrates', 'Dishes with high amount of carbohydrates'],
        303: ['High animal fats', 'Dishes with high animal fats'],
        304: ['High vegetable fats', 'Dishes with high vegetable fats'],

        # by advice
        400: ['By advice', tags_group],
        401: ['Very cool', 'Awesome dish'],

        # by speed
        500: ['By speed', tags_group],
        501: ['Fast', 'Fast to cook'],
        502: ['Fastest', 'Almost there is no need to cook'],
    }

    id = models.IntegerField(
        primary_key=True, null=False, blank=False, unique=True)
    name = models.CharField(max_length=50,
                            null=False,
                            blank=False,
                            unique=True)
    description = models.CharField(
        max_length=300, null=True, blank=True, default='')

    def __str__(self):
        return self.name

    def fill(self):
        """ fill model with choices"""

        for key, value in self.choices.items():
            tag = Tag(
                id=key, name=value[0], description=value[1])
            tag.save()


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
