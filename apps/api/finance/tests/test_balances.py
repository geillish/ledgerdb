from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from finance.choices import AccountType, TransactionCategory
from finance.models import Account, Institution


class BalanceSyncTests(APITestCase):
    def setUp(self):
        self.list_url = reverse("transaction-list")
        self.institution = Institution.objects.create(name="AIB")
        self.account = Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
            opening_balance="3500.00",
            current_balance="3500.00",
        )

    def test_salary_and_shopping_recalculate_balance_correctly(self):
        self.client.post(
            self.list_url,
            {
                "account": str(self.account.pk),
                "transaction_date": "2025-06-01",
                "category": TransactionCategory.SALARY,
                "amount": "2500.00",
            },
            format="json",
        )
        self.client.post(
            self.list_url,
            {
                "account": str(self.account.pk),
                "transaction_date": "2025-06-02",
                "category": TransactionCategory.SHOPPING,
                "amount": "500.00",
            },
            format="json",
        )

        self.account.refresh_from_db()
        self.assertEqual(self.account.current_balance, Decimal("5500.00"))

    def test_other_income_and_transfer_in_increase_balance(self):
        self.client.post(
            self.list_url,
            {
                "account": str(self.account.pk),
                "transaction_date": "2025-06-01",
                "category": TransactionCategory.OTHER_INCOME,
                "amount": "200.00",
            },
            format="json",
        )
        self.client.post(
            self.list_url,
            {
                "account": str(self.account.pk),
                "transaction_date": "2025-06-02",
                "category": TransactionCategory.TRANSFER_IN,
                "amount": "300.00",
            },
            format="json",
        )

        self.account.refresh_from_db()
        self.assertEqual(self.account.current_balance, Decimal("4000.00"))

    def test_transfer_out_decreases_balance(self):
        self.client.post(
            self.list_url,
            {
                "account": str(self.account.pk),
                "transaction_date": "2025-06-02",
                "category": TransactionCategory.TRANSFER_OUT,
                "amount": "400.00",
            },
            format="json",
        )

        self.account.refresh_from_db()
        self.assertEqual(self.account.current_balance, Decimal("3100.00"))

    def test_dashboard_net_worth_uses_recalculated_balance(self):
        self.client.post(
            self.list_url,
            {
                "account": str(self.account.pk),
                "transaction_date": "2025-06-02",
                "category": TransactionCategory.SHOPPING,
                "amount": "500.00",
            },
            format="json",
        )

        response = self.client.get(reverse("dashboard"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["net_worth"], "3000.00")
        self.assertEqual(response.json()["account_balances"][0]["current_balance"], "3000.00")
