from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction as db_transaction

from finance.balances import sync_account_balance
from finance.choices import TransactionCategory
from finance.demo_data import (
    ACCOUNTS,
    CREDIT_CARD_EXPENSES,
    GOALS,
    INSTITUTIONS,
    MONTHLY_SEED_DATA,
    MONTHLY_TRANSFERS,
    PENSION_CONTRIBUTIONS,
    RECURRING_TRANSACTIONS,
    transaction_date,
)
from finance.models import Account, Goal, Institution, RecurringTransaction, Transaction
from finance.spendable import default_include_in_spendable


class Command(BaseCommand):
    help = "Seed a full demo dataset for portfolio deployments."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete all finance data before seeding.",
        )

    def handle(self, *args, **options):
        with db_transaction.atomic():
            if options["reset"]:
                self._reset_data()

            if Institution.objects.exists() and not options["reset"]:
                self.stderr.write(self.style.ERROR("Finance data already exists. Re-run with --reset to replace it."))
                return

            institutions = self._seed_institutions()
            accounts = self._seed_accounts(institutions)
            goals_created = self._seed_goals(accounts)
            transactions_created = self._seed_transactions(accounts)
            recurring_created = self._seed_recurring_transactions(accounts)

        self.stdout.write(
            self.style.SUCCESS(
                "Demo data ready: "
                f"{len(institutions)} institutions, "
                f"{len(accounts)} accounts, "
                f"{goals_created} goals, "
                f"{transactions_created} transactions, "
                f"{recurring_created} recurring payments."
            )
        )

    def _reset_data(self) -> None:
        deleted_transactions, _ = Transaction.objects.all().delete()
        deleted_recurring, _ = RecurringTransaction.objects.all().delete()
        deleted_goals, _ = Goal.objects.all().delete()
        deleted_accounts, _ = Account.objects.all().delete()
        deleted_institutions, _ = Institution.objects.all().delete()
        self.stdout.write(
            f"Cleared {deleted_transactions} transactions, {deleted_recurring} recurring payments, "
            f"{deleted_goals} goals, {deleted_accounts} accounts, {deleted_institutions} institutions."
        )

    def _seed_institutions(self) -> dict[str, Institution]:
        institutions: dict[str, Institution] = {}

        for name in INSTITUTIONS:
            institution, _ = Institution.objects.get_or_create(name=name)
            institutions[name] = institution

        return institutions

    def _seed_accounts(self, institutions: dict[str, Institution]) -> dict[str, Account]:
        accounts: dict[str, Account] = {}

        for account_data in ACCOUNTS:
            account, _ = Account.objects.get_or_create(
                name=account_data["name"],
                defaults={
                    "institution": institutions[account_data["institution"]],
                    "account_type": account_data["account_type"],
                    "opening_balance": account_data["opening_balance"],
                    "current_balance": account_data["opening_balance"],
                    "notes": account_data["notes"],
                    "include_in_spendable": default_include_in_spendable(account_data["account_type"]),
                },
            )
            accounts[account_data["name"]] = account

        return accounts

    def _seed_goals(self, accounts: dict[str, Account]) -> int:
        created = 0

        for goal_data in GOALS:
            _, was_created = Goal.objects.get_or_create(
                name=goal_data["name"],
                defaults={
                    "account": accounts[goal_data["account"]],
                    "target_amount": goal_data["target_amount"],
                    "target_date": goal_data["target_date"],
                    "notes": goal_data["notes"],
                },
            )

            if was_created:
                created += 1

        return created

    def _seed_transactions(self, accounts: dict[str, Account]) -> int:
        current = accounts["Main Current Account"]
        credit_card = accounts["Everyday Card"]
        pension = accounts["Pension Fund"]
        created = 0

        for month_data in MONTHLY_SEED_DATA:
            year = month_data["year"]
            month = month_data["month"]

            Transaction.objects.create(
                account=current,
                transaction_date=transaction_date(year, month, 28),
                category=TransactionCategory.SALARY,
                amount=Decimal(month_data["salary"]),
                note="Monthly salary",
            )
            created += 1

            other_income = month_data.get("other_income")
            if other_income:
                Transaction.objects.create(
                    account=current,
                    transaction_date=transaction_date(year, month, 20),
                    category=TransactionCategory.OTHER_INCOME,
                    amount=Decimal(other_income),
                    note="Gift",
                )
                created += 1

            for day, category, amount, note in month_data["expenses"]:
                Transaction.objects.create(
                    account=current,
                    transaction_date=transaction_date(year, month, day),
                    category=category,
                    amount=Decimal(amount),
                    note=note,
                )
                created += 1

            for transfer in MONTHLY_TRANSFERS:
                transfer_day = transfer["day"]
                amount = Decimal(transfer["amount"])
                destination = accounts[transfer["to_account"]]

                Transaction.objects.create(
                    account=current,
                    transaction_date=transaction_date(year, month, transfer_day),
                    category=TransactionCategory.TRANSFER_OUT,
                    amount=amount,
                    note=transfer["from_note"],
                )
                Transaction.objects.create(
                    account=destination,
                    transaction_date=transaction_date(year, month, transfer_day),
                    category=TransactionCategory.TRANSFER_IN,
                    amount=amount,
                    note=transfer["from_note"],
                )
                created += 2

            for day, category, amount, note in CREDIT_CARD_EXPENSES:
                Transaction.objects.create(
                    account=credit_card,
                    transaction_date=transaction_date(year, month, day),
                    category=category,
                    amount=Decimal(amount),
                    note=note,
                )
                created += 1

        for contribution_date, amount in PENSION_CONTRIBUTIONS:
            Transaction.objects.create(
                account=current,
                transaction_date=contribution_date,
                category=TransactionCategory.TRANSFER_OUT,
                amount=Decimal(amount),
                note="Pension contribution",
            )
            Transaction.objects.create(
                account=pension,
                transaction_date=contribution_date,
                category=TransactionCategory.TRANSFER_IN,
                amount=Decimal(amount),
                note="Pension contribution",
            )
            created += 2

        for account in accounts.values():
            sync_account_balance(account.pk)

        return created

    def _seed_recurring_transactions(self, accounts: dict[str, Account]) -> int:
        created = 0

        for recurring_data in RECURRING_TRANSACTIONS:
            _, was_created = RecurringTransaction.objects.get_or_create(
                account=accounts[recurring_data["account"]],
                note=recurring_data["note"],
                day_of_month=recurring_data["day_of_month"],
                defaults={
                    "category": recurring_data["category"],
                    "amount": recurring_data["amount"],
                    "is_active": True,
                },
            )

            if was_created:
                created += 1

        return created
