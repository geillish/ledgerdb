from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from finance.choices import AccountType
from finance.models import Account, Institution


class AccountAPITests(APITestCase):
    def setUp(self):
        self.list_url = reverse("account-list")
        self.institution = Institution.objects.create(name="Barclays")

    def test_list_returns_empty_array(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), [])

    def test_list_includes_institution_name(self):
        Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
            opening_balance="1250.50",
        )

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["name"], "Current")
        self.assertEqual(data[0]["institution"], str(self.institution.pk))
        self.assertEqual(data[0]["institution_name"], "Barclays")

    def test_create_account(self):
        payload = {
            "institution": str(self.institution.pk),
            "name": "Savings",
            "account_type": AccountType.SAVINGS,
            "opening_balance": "5000.00",
            "notes": "Emergency fund",
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["name"], "Savings")
        self.assertEqual(response.json()["institution_name"], "Barclays")
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
