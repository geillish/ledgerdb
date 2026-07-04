from django.urls import include, path

from rest_framework.routers import DefaultRouter

from finance.views import (
    AccountViewSet,
    GoalViewSet,
    InstitutionViewSet,
    TransactionViewSet,
)

router = DefaultRouter()

router.register("institutions", InstitutionViewSet)
router.register("accounts", AccountViewSet)
router.register("transactions", TransactionViewSet)
router.register("goals", GoalViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
