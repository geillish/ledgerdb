from decimal import Decimal

from rest_framework import serializers

from finance.models import Account
from finance.spendable import default_include_in_spendable


class AccountSerializer(serializers.ModelSerializer):
    institution_name = serializers.CharField(source="institution.name", read_only=True)

    class Meta:
        model = Account
        fields = "__all__"

    def create(self, validated_data):
        balance = validated_data.get("current_balance", Decimal("0.00"))
        validated_data["opening_balance"] = balance

        if "include_in_spendable" not in validated_data:
            validated_data["include_in_spendable"] = default_include_in_spendable(
                validated_data["account_type"]
            )

        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("current_balance", None)
        validated_data.pop("opening_balance", None)
        return super().update(instance, validated_data)
