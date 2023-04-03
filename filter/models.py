"""" all data for filters """
from datetime import datetime

from django.db import models

from user.models import User
from dish.models import Dish, Tag


class Calendar(models.Model):
    """ who and when and what dish has chose """
    date = models.DateTimeField(max_length=200,
                                null=False,
                                blank=False,
                                default=datetime.now)
    user = models.ForeignKey(User,
                             null=False,
                             blank=False,
                             on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish,
                             null=False,
                             blank=False,
                             on_delete=models.DO_NOTHING)
    amount = models.FloatField(null=False,
                               blank=False)


class Like(models.Model):
    """ user like dishes """
    user = models.ForeignKey(User,
                             null=False,
                             blank=False,
                             on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish,
                             null=False,
                             blank=False,
                             on_delete=models.DO_NOTHING)

    class Meta:
        """ only one record: the user likes the dish """
        unique_together = [['user', 'dish']]


class Marking(models.Model):
    """ user tags for dishes """
    user = models.ForeignKey(User,
                             null=False,
                             blank=False,
                             on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish,
                             null=False,
                             blank=False,
                             on_delete=models.DO_NOTHING)
    tag = models.ForeignKey(Tag,
                            null=False,
                            blank=False,
                            on_delete=models.DO_NOTHING)
    value = models.FloatField(default=1,
                              null=False,
                              blank=False)
