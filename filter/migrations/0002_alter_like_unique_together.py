# Generated by Django 4.1.7 on 2023-04-03 20:25

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("dish", "0001_initial"),
        ("user", "0001_initial"),
        ("filter", "0001_initial"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="like",
            unique_together={("user", "dish")},
        ),
    ]