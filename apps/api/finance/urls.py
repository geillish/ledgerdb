from django.urls import include, path

from rest_framework.routers import DefaultRouter

from finance.views import (
    AccountViewSet,
    DashboardView,
    GoalViewSet,
    InstitutionViewSet,
    RecurringTransactionViewSet,
    TransactionViewSet,
)

router = DefaultRouter()

router.register("institutions", InstitutionViewSet)
router.register("accounts", AccountViewSet)
router.register("transactions", TransactionViewSet)
router.register("recurring-transactions", RecurringTransactionViewSet)
router.register("goals", GoalViewSet)

urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("", include(router.urls)),
]
