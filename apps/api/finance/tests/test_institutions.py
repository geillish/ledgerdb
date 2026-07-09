from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from finance.models import Institution
from finance.tests.helpers import paginated_count, paginated_results


class InstitutionAPITests(APITestCase):
    def setUp(self):
        self.list_url = reverse("institution-list")

    def test_list_returns_empty_array(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(paginated_count(response), 0)
        self.assertEqual(paginated_results(response), [])

    def test_create_institution(self):
        response = self.client.post(self.list_url, {"name": "Barclays"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["name"], "Barclays")
        self.assertEqual(Institution.objects.count(), 1)

    def test_create_trims_name(self):
        response = self.client.post(self.list_url, {"name": "  Monzo  "}, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["name"], "Monzo")

    def test_create_rejects_blank_name(self):
        response = self.client.post(self.list_url, {"name": "   "}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.json())

    def test_create_rejects_duplicate_name(self):
        Institution.objects.create(name="Barclays")

        response = self.client.post(self.list_url, {"name": "barclays"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.json())

    def test_update_institution(self):
        institution = Institution.objects.create(name="Barclays")
        detail_url = reverse("institution-detail", kwargs={"pk": institution.pk})

        response = self.client.put(detail_url, {"name": "Monzo"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["name"], "Monzo")

    def test_search_institutions_by_name(self):
        Institution.objects.create(name="Barclays")
        Institution.objects.create(name="Monzo")

        response = self.client.get(self.list_url, {"search": "mon"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(paginated_count(response), 1)
        self.assertEqual(paginated_results(response)[0]["name"], "Monzo")

    def test_delete_institution(self):
        institution = Institution.objects.create(name="Barclays")
        detail_url = reverse("institution-detail", kwargs={"pk": institution.pk})

        response = self.client.delete(detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Institution.objects.count(), 0)

    def test_delete_institution_with_accounts_returns_409(self):
        from finance.models import Account

        institution = Institution.objects.create(name="Barclays")
        Account.objects.create(
            institution=institution,
            name="Current",
            account_type="CURRENT",
        )
        detail_url = reverse("institution-detail", kwargs={"pk": institution.pk})

        response = self.client.delete(detail_url)

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(
            response.json()["detail"],
            "Cannot delete institution with linked accounts.",
        )
        self.assertEqual(Institution.objects.count(), 1)
