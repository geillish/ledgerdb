from rest_framework.viewsets import ModelViewSet

from finance.models import Institution
from finance.serializers import InstitutionSerializer


class InstitutionViewSet(ModelViewSet):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer