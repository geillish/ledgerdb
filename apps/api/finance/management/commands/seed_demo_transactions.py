from calendar import monthrange
from datetime import date
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from finance.balances import sync_account_balance
from finance.choices import AccountType, TransactionCategory
from finance.models import Account, Transaction


def month_end(year: int, month: int) -> int:
    return monthrange(year, month)[1]


MONTHLY_SEED_DATA = [
    {
        "year": 2026,
        "month": 2,
        "salary": "3400.00",
        "expenses": [
            (1, TransactionCategory.RENT, "1250.00", "Rent"),
            (5, TransactionCategory.GROCERIES, "265.40", "Weekly shop"),
            (8, TransactionCategory.BILLS, "188.50", "Electricity"),
            (12, TransactionCategory.TRANSPORT, "112.00", "Bus pass"),
            (15, TransactionCategory.DINING, "72.30", "Restaurant"),
            (22, TransactionCategory.ENTERTAINMENT, "38.00", "Cinema"),
        ],
    },
    {
        "year": 2026,
        "month": 3,
        "salary": "3500.00",
        "expenses": [
            (1, TransactionCategory.RENT, "1250.00", "Rent"),
            (4, TransactionCategory.GROCERIES, "298.20", "Weekly shop"),
            (9, TransactionCategory.BILLS, "205.00", "Internet + phone"),
            (14, TransactionCategory.SHOPPING, "145.99", "Clothes"),
            (18, TransactionCategory.TRANSPORT, "98.50", "Fuel"),
            (25, TransactionCategory.HEALTH, "55.00", "Pharmacy"),
        ],
    },
    {
        "year": 2026,
        "month": 4,
        "salary": "3500.00",
        "expenses": [
            (1, TransactionCategory.RENT, "1250.00", "Rent"),
            (6, TransactionCategory.GROCERIES, "312.80", "Weekly shop"),
            (10, TransactionCategory.BILLS, "221.40", "Utilities"),
            (16, TransactionCategory.DINING, "94.60", "Birthday dinner"),
            (20, TransactionCategory.ENTERTAINMENT, "62.00", "Concert tickets"),
            (27, TransactionCategory.TRANSPORT, "104.00", "Train tickets"),
        ],
    },
    {
        "year": 2026,
        "month": 5,
        "salary": "3600.00",
        "expenses": [
            (1, TransactionCategory.RENT, "1250.00", "Rent"),
            (3, TransactionCategory.GROCERIES, "287.15", "Weekly shop"),
            (11, TransactionCategory.BILLS, "198.75", "Insurance"),
            (15, TransactionCategory.SHOPPING, "210.00", "Home supplies"),
            (19, TransactionCategory.DINING, "48.90", "Takeaway"),
            (24, TransactionCategory.ENTERTAINMENT, "29.99", "Streaming"),
            (28, TransactionCategory.HEALTH, "42.50", "GP visit"),
        ],
    },
    {
        "year": 2026,
        "month": 6,
        "salary": "3500.00",
        "other_income": "150.00",
        "expenses": [
            (1, TransactionCategory.RENT, "1250.00", "Rent"),
            (7, TransactionCategory.GROCERIES, "305.60", "Weekly shop"),
            (9, TransactionCategory.BILLS, "215.30", "Broadband"),
            (13, TransactionCategory.TRANSPORT, "118.00", "Fuel"),
            (17, TransactionCategory.DINING, "67.40", "Lunch out"),
            (21, TransactionCategory.SHOPPING, "89.99", "Books"),
            (26, TransactionCategory.ENTERTAINMENT, "54.00", "Weekend plans"),
        ],
    },
]


class Command(BaseCommand):
    help = "Seed demo income and expense transactions for dashboard monthly trends."

    def add_arguments(self, parser):
        parser.add_argument(
            "--account",
            default="Main Current Account",
            help="Account name to seed transactions into.",
        )
        parser.add_argument(
            "--clear-months",
            action="store_true",
            help="Delete existing seeded transactions in the target months before seeding.",
        )

    def handle(self, *args, **options):
        account_name = options["account"]
        account = Account.objects.filter(name=account_name).first()

        if account is None:
            account = Account.objects.filter(account_type=AccountType.CURRENT).first()

        if account is None:
            self.stderr.write(self.style.ERROR("No current account found to seed."))
            return

        months = {(entry["year"], entry["month"]) for entry in MONTHLY_SEED_DATA}

        with transaction.atomic():
            if options["clear_months"]:
                deleted, _ = Transaction.objects.filter(
                    account=account,
                    transaction_date__year__in=[year for year, _ in months],
                    transaction_date__month__in=[month for _, month in months],
                ).delete()
                self.stdout.write(f"Removed {deleted} existing transactions.")

            created = 0

            for month_data in MONTHLY_SEED_DATA:
                year = month_data["year"]
                month = month_data["month"]
                last_day = month_end(year, month)

                if Transaction.objects.filter(
                    account=account,
                    transaction_date__year=year,
                    transaction_date__month=month,
                    category=TransactionCategory.SALARY,
                ).exists():
                    self.stdout.write(f"Skipping {year}-{month:02d} (salary already exists).")
                    continue

                Transaction.objects.create(
                    account=account,
                    transaction_date=date(year, month, min(28, last_day)),
                    category=TransactionCategory.SALARY,
                    amount=Decimal(month_data["salary"]),
                    note="Monthly salary",
                )
                created += 1

                other_income = month_data.get("other_income")
                if other_income:
                    Transaction.objects.create(
                        account=account,
                        transaction_date=date(year, month, min(20, last_day)),
                        category=TransactionCategory.OTHER_INCOME,
                        amount=Decimal(other_income),
                        note="Gift",
                    )
                    created += 1

                for day, category, amount, note in month_data["expenses"]:
                    Transaction.objects.create(
                        account=account,
                        transaction_date=date(year, month, min(day, last_day)),
                        category=category,
                        amount=Decimal(amount),
                        note=note,
                    )
                    created += 1

            sync_account_balance(account.pk)
            account.refresh_from_db()

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {created} transactions on {account.name}. "
                f"Balance is now {account.current_balance}."
            )
        )
