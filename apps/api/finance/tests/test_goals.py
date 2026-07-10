from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from finance.choices import AccountType
from finance.models import Account, Goal, Institution
from finance.tests.helpers import paginated_count, paginated_results


class GoalAPITests(APITestCase):
    def setUp(self):
        self.list_url = reverse("goal-list")
        self.institution = Institution.objects.create(name="Barclays")
        self.account = Account.objects.create(
            institution=self.institution,
            name="Savings",
            account_type=AccountType.SAVINGS,
            current_balance="1500.00",
        )

    def test_list_returns_empty_array(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(paginated_count(response), 0)
        self.assertEqual(paginated_results(response), [])

    def test_list_includes_account_name_and_current_amount(self):
        Goal.objects.create(
            account=self.account,
            name="Emergency fund",
            target_amount="5000.00",
        )

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = paginated_results(response)
        self.assertEqual(paginated_count(response), 1)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["name"], "Emergency fund")
        self.assertEqual(data[0]["account_name"], "Savings")
        self.assertEqual(data[0]["current_amount"], "1500.00")

    def test_create_goal(self):
        payload = {
            "account": str(self.account.pk),
            "name": "Holiday",
            "target_amount": "2000.00",
            "target_date": "2026-12-01",
            "notes": "Summer trip",
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["name"], "Holiday")
        self.assertEqual(response.json()["target_amount"], "2000.00")
        self.assertEqual(Goal.objects.count(), 1)

    def test_create_goal_without_target_date(self):
        payload = {
            "account": str(self.account.pk),
            "name": "Rainy day",
            "target_amount": "1000.00",
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNone(response.json()["target_date"])

    def test_update_goal(self):
        goal = Goal.objects.create(
            account=self.account,
            name="Emergency fund",
            target_amount="5000.00",
        )
        detail_url = reverse("goal-detail", kwargs={"pk": goal.pk})
        payload = {
            "account": str(self.account.pk),
            "name": "Emergency savings",
            "target_amount": "6000.00",
            "target_date": "2027-01-01",
            "notes": "Updated target",
        }

        response = self.client.put(detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["name"], "Emergency savings")
        self.assertEqual(response.json()["target_amount"], "6000.00")
        self.assertEqual(response.json()["target_date"], "2027-01-01")

    def test_delete_goal(self):
        goal = Goal.objects.create(
            account=self.account,
            name="Emergency fund",
            target_amount="5000.00",
        )
        detail_url = reverse("goal-detail", kwargs={"pk": goal.pk})

        response = self.client.delete(detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Goal.objects.count(), 0)

    def test_filter_by_account(self):
        other_account = Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
        )
        Goal.objects.create(
            account=self.account,
            name="Savings goal",
            target_amount="5000.00",
        )
        Goal.objects.create(
            account=other_account,
            name="Spending cap",
            target_amount="1000.00",
        )

        response = self.client.get(self.list_url, {"account": str(self.account.pk)})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(paginated_count(response), 1)
        self.assertEqual(paginated_results(response)[0]["name"], "Savings goal")
