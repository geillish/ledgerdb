from rest_framework import serializers

from finance.models import Account


class AccountSerializer(serializers.ModelSerializer):
    institution_name = serializers.CharField(source="institution.name", read_only=True)

    class Meta:
        model = Account
        fields = "__all__"
