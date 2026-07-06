from rest_framework.viewsets import ModelViewSet

from finance.models import Transaction
from finance.serializers import TransactionSerializer


class TransactionViewSet(ModelViewSet):
    queryset = Transaction.objects.select_related("account")
    serializer_class = TransactionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        account = self.request.query_params.get("account")
        category = self.request.query_params.get("category")

        if account:
            queryset = queryset.filter(account_id=account)

        if category:
            queryset = queryset.filter(category=category)

        return queryset
