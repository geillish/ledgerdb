from decimal import Decimal

from rest_framework import serializers

from finance.models import RecurringTransaction


class RecurringTransactionSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source="account.name", read_only=True)

    class Meta:
        model = RecurringTransaction
        fields = "__all__"

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")

        return value

    def validate_day_of_month(self, value):
        if value < 1 or value > 28:
            raise serializers.ValidationError("Day of month must be between 1 and 28.")

        return value
