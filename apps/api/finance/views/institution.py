from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from finance.models import Institution
from finance.serializers import InstitutionSerializer


class InstitutionViewSet(ModelViewSet):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    filter_backends = [SearchFilter]
    search_fields = ["name"]

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {"detail": "Cannot delete institution with linked accounts."},
                status=status.HTTP_409_CONFLICT,
            )
