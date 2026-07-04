from rest_framework.viewsets import ModelViewSet

from finance.models import Transaction
from finance.serializers import TransactionSerializer


class TransactionViewSet(ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer