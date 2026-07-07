from decimal import Decimal

from rest_framework import serializers

from finance.models import Account


class AccountSerializer(serializers.ModelSerializer):
    institution_name = serializers.CharField(source="institution.name", read_only=True)

    class Meta:
        model = Account
        fields = "__all__"

    def create(self, validated_data):
        balance = validated_data.get("current_balance", Decimal("0.00"))
        validated_data["opening_balance"] = balance
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("current_balance", None)
        validated_data.pop("opening_balance", None)
        return super().update(instance, validated_data)
