from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from finance.choices import AccountType
from finance.models import Account, Institution
from finance.tests.helpers import paginated_count, paginated_results


class AccountAPITests(APITestCase):
    def setUp(self):
        self.list_url = reverse("account-list")
        self.institution = Institution.objects.create(name="Barclays")

    def test_list_returns_empty_array(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(paginated_count(response), 0)
        self.assertEqual(paginated_results(response), [])

    def test_list_includes_institution_name(self):
        Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
            current_balance="1250.50",
        )

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = paginated_results(response)
        self.assertEqual(paginated_count(response), 1)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["name"], "Current")
        self.assertEqual(data[0]["institution"], str(self.institution.pk))
        self.assertEqual(data[0]["institution_name"], "Barclays")

    def test_create_account(self):
        payload = {
            "institution": str(self.institution.pk),
            "name": "Savings",
            "account_type": AccountType.SAVINGS,
            "current_balance": "5000.00",
            "notes": "Emergency fund",
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["name"], "Savings")
        self.assertEqual(response.json()["institution_name"], "Barclays")
        account = Account.objects.get(name="Savings")
        self.assertEqual(account.opening_balance, Decimal("5000.00"))
        self.assertEqual(account.current_balance, Decimal("5000.00"))
        self.assertEqual(Account.objects.count(), 1)

    def test_retrieve_account(self):
        account = Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
        )
        detail_url = reverse("account-detail", kwargs={"pk": account.pk})

        response = self.client.get(detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["name"], "Current")
        self.assertEqual(response.json()["institution_name"], "Barclays")

    def test_update_account(self):
        account = Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
            current_balance="100.00",
        )
        detail_url = reverse("account-detail", kwargs={"pk": account.pk})
        payload = {
            "institution": str(self.institution.pk),
            "name": "Main Current",
            "account_type": AccountType.SAVINGS,
            "notes": "Updated",
        }

        response = self.client.patch(detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["name"], "Main Current")
        self.assertEqual(response.json()["account_type"], AccountType.SAVINGS)
        self.assertEqual(response.json()["current_balance"], "100.00")
        self.assertEqual(response.json()["notes"], "Updated")

    def test_delete_account(self):
        account = Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
        )
        detail_url = reverse("account-detail", kwargs={"pk": account.pk})

        response = self.client.delete(detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Account.objects.count(), 0)

    def test_delete_account_with_transactions_returns_409(self):
        from finance.choices import TransactionCategory
        from finance.models import Transaction

        account = Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
        )
        Transaction.objects.create(
            account=account,
            transaction_date="2025-01-01",
            category=TransactionCategory.GROCERIES,
            amount="10.00",
        )
        detail_url = reverse("account-detail", kwargs={"pk": account.pk})

        response = self.client.delete(detail_url)

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(
            response.json()["detail"],
            "Cannot delete account with linked transactions or goals.",
        )
        self.assertEqual(Account.objects.count(), 1)
