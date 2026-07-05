from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from finance.models import Account
from finance.serializers import AccountSerializer


class AccountViewSet(ModelViewSet):
    queryset = Account.objects.select_related("institution")
    serializer_class = AccountSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {"detail": "Cannot delete account with linked transactions or goals."},
                status=status.HTTP_409_CONFLICT,
            )
