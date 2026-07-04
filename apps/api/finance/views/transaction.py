from rest_framework.viewsets import ModelViewSet

from finance.models import Transaction
from finance.serializers import TransactionSerializer


class TransactionViewSet(ModelViewSet):
    queryset = Transaction.objects.select_related("account")
    serializer_class = TransactionSerializer
