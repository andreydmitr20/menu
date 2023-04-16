from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'icon']


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'icon']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        """
        Check that username <=3 characters
        """
        if len(data['username']) < 3:
            raise serializers.ValidationError(
                {"username": "Username should be at least 3 chars"})
        return data

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

    def validate_current_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise serializers.ValidationError(
                {'current_password': 'Does not match'})
        return value
