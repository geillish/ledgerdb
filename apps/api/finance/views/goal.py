from rest_framework.viewsets import ModelViewSet

from finance.models import Goal
from finance.serializers import GoalSerializer


class GoalViewSet(ModelViewSet):
    queryset = Goal.objects.select_related("account")
    serializer_class = GoalSerializer
