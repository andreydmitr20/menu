from rest_framework import serializers
from .models import User
from re import match

# Check username


def checkUsername(username: str):
    return match("^[A-Za-z0-9_]{3,50}$", username)


checkUsernameError = "Username should be 3-50 chars and has no spaces."

# Check password


def checkPassword(password: str):
    return match("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,50}$", password)


checkPasswordError = "Password should be 8-50 chars and has one uppercase, one lowercase chars, one digit and one special character #?!@$%^&*-"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'icon']


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'icon']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_username(self, value):

        if not checkUsername(value):
            raise serializers.ValidationError([checkUsernameError])
        return value

    def validate_password(self, value):
        if not checkPassword(value):
            raise serializers.ValidationError([checkPasswordError])
        return value

    def save(self):
        user = User(
            username=self.validated_data['username'],

            email=self.validated_data['email'],
            icon=self.validated_data['icon'],

        )
        password = self.validated_data['password']
        user.set_password(password)
        user.save()
        return user


class PasswordChangeSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(
        style={"input_type": "password"}, required=True)
    new_password = serializers.CharField(
        style={"input_type": "password"}, required=True)

    class Meta:
        model = User
        fields = ['current_password', 'new_password']

    def validate_current_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise serializers.ValidationError(['Does not match'])
        return value

    def validate_new_password(self, value):
        if not checkPassword(value):
            raise serializers.ValidationError([checkPasswordError])
        return value
