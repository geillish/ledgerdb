from rest_framework.viewsets import ModelViewSet

from finance.models import RecurringTransaction
from finance.serializers import RecurringTransactionSerializer


class RecurringTransactionViewSet(ModelViewSet):
    queryset = RecurringTransaction.objects.select_related("account")
    serializer_class = RecurringTransactionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        account = self.request.query_params.get("account")

        if account:
            queryset = queryset.filter(account_id=account)

        return queryset
