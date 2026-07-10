from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from finance.balances import sync_account_balance
from finance.choices import AccountType, TransactionCategory
from finance.demo_data import MONTHLY_SEED_DATA, transaction_date
from finance.models import Account, Transaction


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
                    transaction_date=transaction_date(year, month, 28),
                    category=TransactionCategory.SALARY,
                    amount=Decimal(month_data["salary"]),
                    note="Monthly salary",
                )
                created += 1

                other_income = month_data.get("other_income")
                if other_income:
                    Transaction.objects.create(
                        account=account,
                        transaction_date=transaction_date(year, month, 20),
                        category=TransactionCategory.OTHER_INCOME,
                        amount=Decimal(other_income),
                        note="Gift",
                    )
                    created += 1

                for day, category, amount, note in month_data["expenses"]:
                    Transaction.objects.create(
                        account=account,
                        transaction_date=transaction_date(year, month, day),
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
