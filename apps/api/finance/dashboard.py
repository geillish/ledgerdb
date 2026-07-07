from calendar import monthrange
from datetime import date
from decimal import Decimal

from django.db.models import Sum
from django.db.models.functions import TruncMonth

from finance.choices import AccountType, TransactionCategory
from finance.models import Account, Goal, Transaction

INCOME_CATEGORIES = {TransactionCategory.SALARY}
EXCLUDED_FROM_SPENDING = {TransactionCategory.SALARY, TransactionCategory.TRANSFER}
LIABILITY_ACCOUNT_TYPES = {AccountType.CREDIT_CARD, AccountType.LOAN}
SPENDING_MONTHS = 6


def format_amount(value: Decimal) -> str:
    return str(value.quantize(Decimal("0.01")))


def month_start(value: date) -> date:
    return value.replace(day=1)


def add_months(value: date, months: int) -> date:
    month_index = value.month - 1 + months
    year = value.year + month_index // 12
    month = month_index % 12 + 1
    return date(year, month, 1)


def month_key(value: date) -> str:
    return value.strftime("%Y-%m")


def month_label(value: date) -> str:
    return value.strftime("%b %Y")


def build_spending_months(reference_date: date) -> list[date]:
    current_month = month_start(reference_date)
    start_month = add_months(current_month, -(SPENDING_MONTHS - 1))
    months: list[date] = []

    cursor = start_month
    while cursor <= current_month:
        months.append(cursor)
        cursor = add_months(cursor, 1)

    return months


def get_net_worth() -> dict[str, str]:
    total_assets = Decimal("0.00")
    total_liabilities = Decimal("0.00")

    for account in Account.objects.all():
        balance = account.current_balance

        if account.account_type in LIABILITY_ACCOUNT_TYPES:
            total_liabilities += balance
        else:
            total_assets += balance

    net_worth = total_assets - total_liabilities

    return {
        "net_worth": format_amount(net_worth),
        "total_assets": format_amount(total_assets),
        "total_liabilities": format_amount(total_liabilities),
    }


def get_account_balances() -> list[dict[str, str]]:
    balances: list[dict[str, str]] = []

    for account in Account.objects.select_related("institution").order_by("name"):
        balances.append(
            {
                "id": str(account.pk),
                "name": account.name,
                "account_type": account.account_type,
                "institution_name": account.institution.name,
                "current_balance": format_amount(account.current_balance),
            }
        )

    return balances


def get_monthly_totals(reference_date: date) -> dict[str, str]:
    month_end = date(
        reference_date.year,
        reference_date.month,
        monthrange(reference_date.year, reference_date.month)[1],
    )

    spending_total = (
        Transaction.objects.filter(
            transaction_date__gte=month_start(reference_date),
            transaction_date__lte=month_end,
        )
        .exclude(category__in=EXCLUDED_FROM_SPENDING)
        .aggregate(total=Sum("amount"))["total"]
        or Decimal("0.00")
    )

    income_total = (
        Transaction.objects.filter(
            transaction_date__gte=month_start(reference_date),
            transaction_date__lte=month_end,
            category__in=INCOME_CATEGORIES,
        ).aggregate(total=Sum("amount"))["total"]
        or Decimal("0.00")
    )

    return {
        "month": month_key(reference_date),
        "spending_total": format_amount(spending_total),
        "income_total": format_amount(income_total),
    }


def get_spending_by_category(reference_date: date) -> list[dict[str, str]]:
    month_end = date(
        reference_date.year,
        reference_date.month,
        monthrange(reference_date.year, reference_date.month)[1],
    )

    rows = (
        Transaction.objects.filter(
            transaction_date__gte=month_start(reference_date),
            transaction_date__lte=month_end,
        )
        .exclude(category__in=EXCLUDED_FROM_SPENDING)
        .values("category")
        .annotate(total=Sum("amount"))
        .order_by("-total", "category")
    )

    return [
        {
            "category": row["category"],
            "total": format_amount(row["total"]),
        }
        for row in rows
    ]


def get_spending_by_month(reference_date: date) -> list[dict[str, str]]:
    months = build_spending_months(reference_date)
    start_date = months[0]
    month_end = date(
        reference_date.year,
        reference_date.month,
        monthrange(reference_date.year, reference_date.month)[1],
    )

    totals = {
        month_key(row["month"]): row["total"]
        for row in Transaction.objects.filter(
            transaction_date__gte=start_date,
            transaction_date__lte=month_end,
        )
        .exclude(category__in=EXCLUDED_FROM_SPENDING)
        .annotate(month=TruncMonth("transaction_date"))
        .values("month")
        .annotate(total=Sum("amount"))
    }

    return [
        {
            "month": month_key(month),
            "label": month_label(month),
            "total": format_amount(totals.get(month_key(month), Decimal("0.00"))),
        }
        for month in months
    ]


def get_goals_summary() -> list[dict[str, str]]:
    goals: list[dict[str, str]] = []

    for goal in Goal.objects.select_related("account").order_by("name"):
        goals.append(
            {
                "id": str(goal.pk),
                "name": goal.name,
                "account_name": goal.account.name,
                "target_amount": format_amount(goal.target_amount),
                "current_amount": format_amount(goal.account.current_balance),
            }
        )

    return goals


def build_dashboard(reference_date: date | None = None) -> dict:
    today = reference_date or date.today()
    net_worth = get_net_worth()
    monthly_totals = get_monthly_totals(today)

    return {
        **net_worth,
        "month": monthly_totals["month"],
        "monthly_spending": monthly_totals["spending_total"],
        "monthly_income": monthly_totals["income_total"],
        "account_balances": get_account_balances(),
        "spending_by_category": get_spending_by_category(today),
        "spending_by_month": get_spending_by_month(today),
        "goals": get_goals_summary(),
    }
