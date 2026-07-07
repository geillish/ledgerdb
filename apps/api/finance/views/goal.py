from rest_framework.viewsets import ModelViewSet

from finance.models import Goal
from finance.serializers import GoalSerializer


class GoalViewSet(ModelViewSet):
    queryset = Goal.objects.select_related("account")
    serializer_class = GoalSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        account = self.request.query_params.get("account")

        if account:
            queryset = queryset.filter(account_id=account)

        return queryset
