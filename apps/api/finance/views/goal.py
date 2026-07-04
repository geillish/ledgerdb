from rest_framework.viewsets import ModelViewSet

from finance.models import Goal
from finance.serializers import GoalSerializer


class GoalViewSet(ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer