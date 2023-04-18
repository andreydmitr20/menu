# Generated by Django 4.1.7 on 2023-04-18 11:05

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("dish", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Calendar",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "date",
                    models.DateTimeField(default=datetime.datetime.now, max_length=200),
                ),
                ("amount", models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name="Like",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Marking",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("value", models.FloatField(default=1)),
                (
                    "dish",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING, to="dish.dish"
                    ),
                ),
                (
                    "tag",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING, to="dish.tag"
                    ),
                ),
            ],
        ),
    ]
