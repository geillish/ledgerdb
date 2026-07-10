from rest_framework import serializers

from finance.models import Goal


class GoalSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source="account.name", read_only=True)
    current_amount = serializers.DecimalField(
        source="account.current_balance",
        read_only=True,
        max_digits=12,
        decimal_places=2,
    )

    class Meta:
        model = Goal
        fields = "__all__"
