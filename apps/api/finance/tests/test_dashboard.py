from datetime import date

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from finance.choices import AccountType, TransactionCategory
from finance.models import Account, Goal, Institution, Transaction


class DashboardAPITests(APITestCase):
    def setUp(self):
        self.url = reverse("dashboard")
        self.institution = Institution.objects.create(name="Barclays")
        self.reference_date = date(2026, 7, 15)

    def test_dashboard_returns_empty_summary(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["net_worth"], "0.00")
        self.assertEqual(data["total_assets"], "0.00")
        self.assertEqual(data["total_liabilities"], "0.00")
        self.assertEqual(data["monthly_spending"], "0.00")
        self.assertEqual(data["monthly_income"], "0.00")
        self.assertEqual(data["account_balances"], [])
        self.assertEqual(data["spending_by_category"], [])
        self.assertEqual(len(data["spending_by_month"]), 6)
        self.assertEqual(data["goals"], [])
        self.assertEqual(data["spendable"]["total"], "0.00")

    def test_dashboard_calculates_net_worth(self):
        Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
            current_balance="1500.00",
        )
        Account.objects.create(
            institution=self.institution,
            name="Credit card",
            account_type=AccountType.CREDIT_CARD,
            current_balance="250.00",
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["total_assets"], "1500.00")
        self.assertEqual(data["total_liabilities"], "250.00")
        self.assertEqual(data["net_worth"], "1250.00")
        self.assertEqual(len(data["account_balances"]), 2)

    def test_dashboard_monthly_spending_excludes_income_and_transfers(self):
        account = Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
        )
        Transaction.objects.create(
            account=account,
            transaction_date=self.reference_date,
            category=TransactionCategory.GROCERIES,
            amount="42.50",
        )
        Transaction.objects.create(
            account=account,
            transaction_date=self.reference_date,
            category=TransactionCategory.SALARY,
            amount="2500.00",
        )
        Transaction.objects.create(
            account=account,
            transaction_date=self.reference_date,
            category=TransactionCategory.TRANSFER_OUT,
            amount="100.00",
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["monthly_spending"], "42.50")
        self.assertEqual(data["monthly_income"], "2500.00")
        self.assertEqual(len(data["spending_by_category"]), 1)
        self.assertEqual(data["spending_by_category"][0]["category"], TransactionCategory.GROCERIES)
        self.assertEqual(data["spending_by_category"][0]["total"], "42.50")

    def test_dashboard_monthly_income_includes_other_income(self):
        account = Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
        )
        Transaction.objects.create(
            account=account,
            transaction_date=self.reference_date,
            category=TransactionCategory.OTHER_INCOME,
            amount="100.00",
        )
        Transaction.objects.create(
            account=account,
            transaction_date=self.reference_date,
            category=TransactionCategory.SALARY,
            amount="50.00",
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["monthly_income"], "150.00")

    def test_dashboard_includes_goals_summary(self):
        account = Account.objects.create(
            institution=self.institution,
            name="Savings",
            account_type=AccountType.SAVINGS,
            current_balance="750.00",
        )
        Goal.objects.create(
            account=account,
            name="Emergency fund",
            target_amount="5000.00",
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data["goals"]), 1)
        self.assertEqual(data["goals"][0]["name"], "Emergency fund")
        self.assertEqual(data["goals"][0]["current_amount"], "750.00")
        self.assertEqual(data["goals"][0]["target_amount"], "5000.00")

    def test_dashboard_spending_by_month_returns_six_months(self):
        account = Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
        )
        Transaction.objects.create(
            account=account,
            transaction_date=date(2026, 5, 10),
            category=TransactionCategory.BILLS,
            amount="80.00",
        )
        Transaction.objects.create(
            account=account,
            transaction_date=date(2026, 7, 3),
            category=TransactionCategory.DINING,
            amount="35.00",
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data["spending_by_month"]), 6)
        self.assertEqual(data["spending_by_month"][0]["month"], "2026-02")
        self.assertEqual(data["spending_by_month"][-1]["month"], "2026-07")
        self.assertEqual(data["spending_by_month"][3]["month"], "2026-05")
        self.assertEqual(data["spending_by_month"][3]["total"], "80.00")
        self.assertEqual(data["spending_by_month"][-1]["total"], "35.00")
