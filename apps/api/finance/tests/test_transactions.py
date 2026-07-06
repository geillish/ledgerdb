from datetime import date

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from finance.choices import AccountType, TransactionCategory
from finance.models import Account, Institution, Transaction


class TransactionAPITests(APITestCase):
    def setUp(self):
        self.list_url = reverse("transaction-list")
        self.institution = Institution.objects.create(name="Barclays")
        self.account = Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
        )
        self.savings = Account.objects.create(
            institution=self.institution,
            name="Savings",
            account_type=AccountType.SAVINGS,
        )

    def test_list_returns_empty_array(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), [])

    def test_list_includes_account_name(self):
        Transaction.objects.create(
            account=self.account,
            transaction_date=date(2025, 6, 1),
            category=TransactionCategory.GROCERIES,
            amount="42.50",
            note="Weekly shop",
        )

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["account"], str(self.account.pk))
        self.assertEqual(data[0]["account_name"], "Current")
        self.assertEqual(data[0]["category"], TransactionCategory.GROCERIES)

    def test_create_transaction(self):
        payload = {
            "account": str(self.account.pk),
            "transaction_date": "2025-06-15",
            "category": TransactionCategory.SALARY,
            "amount": "2500.00",
            "note": "Monthly pay",
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["amount"], "2500.00")
        self.assertEqual(response.json()["account_name"], "Current")
        self.assertEqual(Transaction.objects.count(), 1)

    def test_update_transaction(self):
        transaction = Transaction.objects.create(
            account=self.account,
            transaction_date=date(2025, 6, 1),
            category=TransactionCategory.GROCERIES,
            amount="10.00",
        )
        detail_url = reverse("transaction-detail", kwargs={"pk": transaction.pk})
        payload = {
            "account": str(self.savings.pk),
            "transaction_date": "2025-06-02",
            "category": TransactionCategory.TRANSPORT,
            "amount": "15.50",
            "note": "Train ticket",
        }

        response = self.client.put(detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["account"], str(self.savings.pk))
        self.assertEqual(response.json()["account_name"], "Savings")
        self.assertEqual(response.json()["category"], TransactionCategory.TRANSPORT)
        self.assertEqual(response.json()["amount"], "15.50")
        self.assertEqual(response.json()["note"], "Train ticket")

    def test_delete_transaction(self):
        transaction = Transaction.objects.create(
            account=self.account,
            transaction_date=date(2025, 6, 1),
            category=TransactionCategory.GROCERIES,
            amount="10.00",
        )
        detail_url = reverse("transaction-detail", kwargs={"pk": transaction.pk})

        response = self.client.delete(detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Transaction.objects.count(), 0)

    def test_filter_by_account(self):
        Transaction.objects.create(
            account=self.account,
            transaction_date=date(2025, 6, 1),
            category=TransactionCategory.GROCERIES,
            amount="10.00",
        )
        Transaction.objects.create(
            account=self.savings,
            transaction_date=date(2025, 6, 2),
            category=TransactionCategory.SAVINGS,
            amount="100.00",
        )

        response = self.client.get(self.list_url, {"account": str(self.account.pk)})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]["account_name"], "Current")

    def test_filter_by_category(self):
        Transaction.objects.create(
            account=self.account,
            transaction_date=date(2025, 6, 1),
            category=TransactionCategory.GROCERIES,
            amount="10.00",
        )
        Transaction.objects.create(
            account=self.account,
            transaction_date=date(2025, 6, 2),
            category=TransactionCategory.SALARY,
            amount="2500.00",
        )

        response = self.client.get(self.list_url, {"category": TransactionCategory.SALARY})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]["category"], TransactionCategory.SALARY)
