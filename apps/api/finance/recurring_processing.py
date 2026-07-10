from calendar import monthrange
from datetime import date

from django.utils import timezone

from finance.models import RecurringTransaction, Transaction


def recurring_occurrence_date(recurring: RecurringTransaction, reference_date: date) -> date:
    last_day = monthrange(reference_date.year, reference_date.month)[1]
    return date(
        reference_date.year,
        reference_date.month,
        min(recurring.day_of_month, last_day),
    )


def recurring_already_processed(recurring: RecurringTransaction, reference_date: date) -> bool:
    return Transaction.objects.filter(
        recurring_transaction=recurring,
        transaction_date__year=reference_date.year,
        transaction_date__month=reference_date.month,
    ).exists()


def should_process_recurring(recurring: RecurringTransaction, reference_date: date) -> bool:
    if not recurring.is_active:
        return False

    occurrence_date = recurring_occurrence_date(recurring, reference_date)

    if occurrence_date > reference_date:
        return False

    return not recurring_already_processed(recurring, reference_date)


def process_recurring_transactions(reference_date: date | None = None) -> list[Transaction]:
    today = reference_date or timezone.localdate()
    created: list[Transaction] = []

    for recurring in RecurringTransaction.objects.filter(is_active=True).select_related("account"):
        if not should_process_recurring(recurring, today):
            continue

        transaction = Transaction.objects.create(
            account=recurring.account,
            transaction_date=recurring_occurrence_date(recurring, today),
            category=recurring.category,
            amount=recurring.amount,
            note=recurring.note,
            recurring_transaction=recurring,
        )
        created.append(transaction)

    return created
