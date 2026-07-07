from rest_framework.response import Response
from rest_framework.views import APIView

from finance.dashboard import build_dashboard


class DashboardView(APIView):
    def get(self, request):
        return Response(build_dashboard())
