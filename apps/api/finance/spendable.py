from calendar import monthrange
from datetime import date
from decimal import Decimal

from finance.category_groups import INCOME_CATEGORIES
from finance.choices import AccountType
from finance.models import Account, RecurringTransaction

LIABILITY_ACCOUNT_TYPES = {AccountType.CREDIT_CARD, AccountType.LOAN}
SPENDABLE_ACCOUNT_TYPES = {AccountType.CURRENT, AccountType.CASH}


def format_amount(value: Decimal) -> str:
    return str(value.quantize(Decimal("0.01")))


def default_include_in_spendable(account_type: str) -> bool:
    return account_type in SPENDABLE_ACCOUNT_TYPES


def account_spendable_contribution(account: Account) -> Decimal:
    if not account.include_in_spendable:
        return Decimal("0.00")

    if account.account_type in LIABILITY_ACCOUNT_TYPES:
        return -account.current_balance

    return account.current_balance


def is_upcoming_this_month(day_of_month: int, reference_date: date) -> bool:
    last_day = monthrange(reference_date.year, reference_date.month)[1]
    occurrence_day = min(day_of_month, last_day)
    return occurrence_day >= reference_date.day


def recurring_occurrence_day(day_of_month: int, reference_date: date) -> int:
    last_day = monthrange(reference_date.year, reference_date.month)[1]
    return min(day_of_month, last_day)


def get_spendable_summary(reference_date: date | None = None) -> dict:
    today = reference_date or date.today()
    account_total = Decimal("0.00")
    upcoming_income = Decimal("0.00")
    upcoming_expenses = Decimal("0.00")
    breakdown: list[dict] = []

    for account in Account.objects.select_related("institution").order_by("name"):
        contribution = account_spendable_contribution(account)

        if contribution == 0:
            continue

        account_total += contribution
        breakdown.append(
            {
                "label": account.name,
                "type": "account",
                "amount": format_amount(contribution),
                "due_day": None,
            }
        )

    for recurring in RecurringTransaction.objects.filter(is_active=True).select_related("account"):
        if not is_upcoming_this_month(recurring.day_of_month, today):
            continue

        if not recurring.account.include_in_spendable:
            continue

        amount = recurring.amount
        due_day = recurring_occurrence_day(recurring.day_of_month, today)
        label = recurring.note or recurring.category

        if recurring.category in INCOME_CATEGORIES:
            upcoming_income += amount
            breakdown.append(
                {
                    "label": label,
                    "type": "income",
                    "amount": format_amount(amount),
                    "due_day": due_day,
                }
            )
        else:
            upcoming_expenses += amount
            breakdown.append(
                {
                    "label": label,
                    "type": "expense",
                    "amount": format_amount(-amount),
                    "due_day": due_day,
                }
            )

    total = account_total + upcoming_income - upcoming_expenses

    return {
        "total": format_amount(total),
        "account_balances_total": format_amount(account_total),
        "upcoming_income_total": format_amount(upcoming_income),
        "upcoming_expenses_total": format_amount(upcoming_expenses),
        "breakdown": breakdown,
    }
