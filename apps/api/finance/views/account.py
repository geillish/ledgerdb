from rest_framework.viewsets import ModelViewSet

from finance.models import Account
from finance.serializers import AccountSerializer


class AccountViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer