""" User extends AbstractBaseUser"""
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        PermissionsMixin)
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, email, icon=None, password=None):
        if not email:
            raise ValueError('email address is required')

        user = self.model(
            username=username,
            email=self.normalize_email(email),
            icon=icon
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, icon=None, password=None):
        user = self.create_user(
            username, email, icon, password=password
        )

        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True

        user.save(using=self._db)
        return user


class User (AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        max_length=255,
        unique=True
    )

    email = models.EmailField(
        max_length=100,
        unique=True,
        verbose_name='email address'

    )

    icon = models.CharField(max_length=400,
                            blank=True, null=True)

    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'auth_user'

    def __str__(self):
        return self.username+' '+self.email+' '+self.icon
