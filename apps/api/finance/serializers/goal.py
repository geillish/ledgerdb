from rest_framework import serializers

from finance.models import Goal


class GoalSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source="account.name", read_only=True)

    class Meta:
        model = Goal
        fields = "__all__"
