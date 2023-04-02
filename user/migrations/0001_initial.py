# Generated by Django 4.1.7 on 2023-04-02 20:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="User",
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
                ("name", models.CharField(max_length=200, unique=True)),
                ("contacts", models.CharField(blank=True, max_length=400)),
                ("icon", models.CharField(blank=True, max_length=400)),
            ],
        ),
        migrations.CreateModel(
            name="Auth",
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
                ("login", models.CharField(max_length=50, unique=True)),
                ("password", models.CharField(max_length=50)),
                (
                    "jwt",
                    models.CharField(
                        blank=True, max_length=400, null=True, unique=True
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="user.user"
                    ),
                ),
            ],
        ),
    ]