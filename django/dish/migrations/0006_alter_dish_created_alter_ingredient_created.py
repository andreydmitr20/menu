# Generated by Django 4.1.7 on 2023-04-28 16:09

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("dish", "0005_dish_created_ingredient_created"),
    ]

    operations = [
        migrations.AlterField(
            model_name="dish",
            name="created",
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name="ingredient",
            name="created",
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
