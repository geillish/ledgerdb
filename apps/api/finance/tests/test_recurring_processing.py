from datetime import date
from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from finance.choices import AccountType, TransactionCategory
from finance.models import Account, Institution, RecurringTransaction, Transaction
from finance.recurring_processing import process_recurring_transactions


class ProcessRecurringTransactionsTests(APITestCase):
    def setUp(self):
        self.institution = Institution.objects.create(name="Barclays")
        self.current = Account.objects.create(
            institution=self.institution,
            name="Current",
            account_type=AccountType.CURRENT,
            opening_balance="2000.00",
            current_balance="2000.00",
        )
        self.savings = Account.objects.create(
            institution=self.institution,
            name="Savings",
            account_type=AccountType.SAVINGS,
            opening_balance="500.00",
            current_balance="500.00",
        )

    def test_creates_transaction_when_due_date_reached(self):
        recurring = RecurringTransaction.objects.create(
            account=self.current,
            category=TransactionCategory.RENT,
            amount="1250.00",
            note="Rent",
            day_of_month=2,
        )

        created = process_recurring_transactions(date(2026, 7, 2))

        self.assertEqual(len(created), 1)
        transaction = Transaction.objects.get()
        self.assertEqual(transaction.recurring_transaction, recurring)
        self.assertEqual(transaction.transaction_date, date(2026, 7, 2))
        self.assertEqual(transaction.amount, Decimal(recurring.amount))
        self.current.refresh_from_db()
        self.assertEqual(self.current.current_balance, Decimal("750.00"))

    def test_creates_paired_transfer_transactions(self):
        RecurringTransaction.objects.create(
            account=self.current,
            category=TransactionCategory.TRANSFER_OUT,
            amount="200.00",
            note="Emergency savings",
            day_of_month=2,
        )
        RecurringTransaction.objects.create(
            account=self.savings,
            category=TransactionCategory.TRANSFER_IN,
            amount="200.00",
            note="Emergency savings",
            day_of_month=2,
        )

        created = process_recurring_transactions(date(2026, 7, 2))

        self.assertEqual(len(created), 2)
        self.assertEqual(Transaction.objects.count(), 2)
        self.current.refresh_from_db()
        self.savings.refresh_from_db()
        self.assertEqual(self.current.current_balance, Decimal("1800.00"))
        self.assertEqual(self.savings.current_balance, Decimal("700.00"))

    def test_skips_future_recurring_payments(self):
        RecurringTransaction.objects.create(
            account=self.current,
            category=TransactionCategory.SALARY,
            amount="3500.00",
            note="Salary",
            day_of_month=28,
        )

        created = process_recurring_transactions(date(2026, 7, 15))

        self.assertEqual(created, [])
        self.assertEqual(Transaction.objects.count(), 0)

    def test_does_not_duplicate_transactions_in_same_month(self):
        recurring = RecurringTransaction.objects.create(
            account=self.current,
            category=TransactionCategory.BILLS,
            amount="230.00",
            note="Utilities",
            day_of_month=9,
        )

        first_run = process_recurring_transactions(date(2026, 7, 9))
        second_run = process_recurring_transactions(date(2026, 7, 15))

        self.assertEqual(len(first_run), 1)
        self.assertEqual(second_run, [])
        self.assertEqual(Transaction.objects.filter(recurring_transaction=recurring).count(), 1)

    def test_catches_up_missed_day_later_in_month(self):
        RecurringTransaction.objects.create(
            account=self.current,
            category=TransactionCategory.BILLS,
            amount="230.00",
            note="Utilities",
            day_of_month=9,
        )

        created = process_recurring_transactions(date(2026, 7, 15))

        self.assertEqual(len(created), 1)
        self.assertEqual(created[0].transaction_date, date(2026, 7, 9))

    def test_skips_inactive_recurring_payments(self):
        RecurringTransaction.objects.create(
            account=self.current,
            category=TransactionCategory.RENT,
            amount="1250.00",
            note="Rent",
            day_of_month=1,
            is_active=False,
        )

        created = process_recurring_transactions(date(2026, 7, 15))

        self.assertEqual(created, [])
