from django import forms
from django.contrib.auth.models import User
from .models import UserAccount

class UserForm(forms.ModelForm):
    """Form definition for User."""

    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        """Meta definition for Userform."""

        model = User
        fields = ('username', 'email', 'password',)

class UserAccountForm(forms.ModelForm):
    """Form definition for UserProfile."""

    class Meta:
        """Meta definition for UserProfileform."""

        model = UserAccount
        fields = ('preferences',)