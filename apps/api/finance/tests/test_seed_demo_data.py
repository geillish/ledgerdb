from io import StringIO

from django.core.management import call_command
from django.test import TestCase

from finance.models import Account, Goal, Institution, RecurringTransaction, Transaction


class SeedDemoDataCommandTests(TestCase):
    def test_seed_demo_data_creates_full_dataset(self):
        out = StringIO()
        call_command("seed_demo_data", stdout=out)

        self.assertEqual(Institution.objects.count(), 3)
        self.assertEqual(Account.objects.count(), 6)
        self.assertEqual(Goal.objects.count(), 3)
        self.assertGreater(Transaction.objects.count(), 50)
        self.assertEqual(RecurringTransaction.objects.count(), 11)
        self.assertIn("Demo data ready", out.getvalue())

    def test_seed_demo_data_reset_replaces_existing_data(self):
        call_command("seed_demo_data")
        first_transaction_count = Transaction.objects.count()

        out = StringIO()
        call_command("seed_demo_data", "--reset", stdout=out)

        self.assertEqual(Institution.objects.count(), 3)
        self.assertEqual(Transaction.objects.count(), first_transaction_count)
        self.assertIn("Demo data ready", out.getvalue())

    def test_seed_demo_data_refuses_when_data_exists(self):
        call_command("seed_demo_data")

        err = StringIO()
        call_command("seed_demo_data", stderr=err)

        self.assertIn("already exists", err.getvalue())
