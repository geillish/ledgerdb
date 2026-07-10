from datetime import date
from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from finance.choices import AccountType, TransactionCategory
from finance.models import Account, Institution, RecurringTransaction
from finance.spendable import get_spendable_summary
from finance.tests.helpers import paginated_count, paginated_results


class RecurringTransactionAPITests(APITestCase):
    def setUp(self):
        self.list_url = reverse("recurringtransaction-list")
        self.institution = Institution.objects.create(name="Barclays")
        self.account = Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
            opening_balance="1000.00",
            current_balance="1000.00",
            include_in_spendable=True,
        )

    def test_list_returns_empty_paginated_response(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(paginated_count(response), 0)
        self.assertEqual(paginated_results(response), [])

    def test_create_recurring_transaction(self):
        payload = {
            "account": str(self.account.pk),
            "category": TransactionCategory.RENT,
            "amount": "1250.00",
            "note": "Rent",
            "day_of_month": 1,
            "is_active": True,
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["note"], "Rent")
        self.assertEqual(response.json()["day_of_month"], 1)
        self.assertEqual(RecurringTransaction.objects.count(), 1)

    def test_create_rejects_invalid_day_of_month(self):
        payload = {
            "account": str(self.account.pk),
            "category": TransactionCategory.RENT,
            "amount": "1250.00",
            "note": "Rent",
            "day_of_month": 31,
            "is_active": True,
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("day_of_month", response.json())

    def test_filter_by_account(self):
        other_account = Account.objects.create(
            institution=self.institution,
            name="Savings",
            account_type=AccountType.SAVINGS,
        )
        RecurringTransaction.objects.create(
            account=self.account,
            category=TransactionCategory.SALARY,
            amount="2500.00",
            note="Salary",
            day_of_month=28,
        )
        RecurringTransaction.objects.create(
            account=other_account,
            category=TransactionCategory.SAVINGS,
            amount="200.00",
            note="Savings",
            day_of_month=2,
        )

        response = self.client.get(self.list_url, {"account": str(self.account.pk)})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(paginated_count(response), 1)
        self.assertEqual(paginated_results(response)[0]["note"], "Salary")


class SpendableSummaryTests(APITestCase):
    def setUp(self):
        self.institution = Institution.objects.create(name="Barclays")
        self.current = Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
            opening_balance="2000.00",
            current_balance="2000.00",
            include_in_spendable=True,
        )
        Account.objects.create(
            institution=self.institution,
            name="Savings",
            account_type=AccountType.SAVINGS,
            opening_balance="1500.00",
            current_balance="1500.00",
            include_in_spendable=False,
        )

    def test_spendable_uses_only_included_accounts(self):
        summary = get_spendable_summary(date(2026, 7, 15))

        self.assertEqual(summary["account_balances_total"], "2000.00")
        self.assertEqual(summary["total"], "2000.00")

    def test_spendable_includes_upcoming_income_and_expenses(self):
        RecurringTransaction.objects.create(
            account=self.current,
            category=TransactionCategory.SALARY,
            amount="3500.00",
            note="Salary",
            day_of_month=28,
        )
        RecurringTransaction.objects.create(
            account=self.current,
            category=TransactionCategory.BILLS,
            amount="230.00",
            note="Utilities",
            day_of_month=20,
        )
        RecurringTransaction.objects.create(
            account=self.current,
            category=TransactionCategory.RENT,
            amount="1250.00",
            note="Rent",
            day_of_month=1,
        )

        summary = get_spendable_summary(date(2026, 7, 15))

        self.assertEqual(summary["account_balances_total"], "2000.00")
        self.assertEqual(summary["upcoming_income_total"], "3500.00")
        self.assertEqual(summary["upcoming_expenses_total"], "230.00")
        self.assertEqual(summary["total"], "5270.00")

    def test_spendable_ignores_transfer_in_to_non_spendable_accounts(self):
        savings = Account.objects.get(name="Savings")
        RecurringTransaction.objects.create(
            account=self.current,
            category=TransactionCategory.TRANSFER_OUT,
            amount="200.00",
            note="Emergency savings",
            day_of_month=20,
        )
        RecurringTransaction.objects.create(
            account=savings,
            category=TransactionCategory.TRANSFER_IN,
            amount="200.00",
            note="Emergency savings",
            day_of_month=20,
        )

        summary = get_spendable_summary(date(2026, 7, 15))

        self.assertEqual(summary["upcoming_income_total"], "0.00")
        self.assertEqual(summary["upcoming_expenses_total"], "200.00")
        self.assertEqual(summary["total"], "1800.00")

    def test_dashboard_includes_spendable_summary(self):
        RecurringTransaction.objects.create(
            account=self.current,
            category=TransactionCategory.SALARY,
            amount="3500.00",
            note="Salary",
            day_of_month=28,
        )

        response = self.client.get(reverse("dashboard"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        spendable = response.json()["spendable"]
        self.assertEqual(spendable["account_balances_total"], "2000.00")
        self.assertEqual(spendable["upcoming_income_total"], "3500.00")
        self.assertEqual(spendable["total"], "5500.00")
