from decimal import Decimal

from finance.category_groups import INCOME_CATEGORIES
from finance.choices import AccountType
from finance.models import Account, Transaction

LIABILITY_ACCOUNT_TYPES = {AccountType.CREDIT_CARD, AccountType.LOAN}


def transaction_balance_delta(
    account_type: str,
    category: str,
    amount: Decimal | str | float,
) -> Decimal:
    value = abs(Decimal(amount))

    if category in INCOME_CATEGORIES:
        return value

    if account_type in LIABILITY_ACCOUNT_TYPES:
        return value

    return -value


def calculate_transaction_delta_sum(account: Account) -> Decimal:
    total = Decimal("0.00")

    for transaction in Transaction.objects.filter(account_id=account.pk):
        total += transaction_balance_delta(
            account.account_type,
            transaction.category,
            transaction.amount,
        )

    return total


def sync_account_balance(account_id) -> None:
    account = Account.objects.get(pk=account_id)
    total_delta = calculate_transaction_delta_sum(account)
    new_balance = account.opening_balance + total_delta

    Account.objects.filter(pk=account_id).update(current_balance=new_balance)


def sync_accounts_for_transaction(
    *,
    current_account_id,
    previous_account_id=None,
) -> None:
    account_ids = {current_account_id}

    if previous_account_id:
        account_ids.add(previous_account_id)

    for account_id in account_ids:
        sync_account_balance(account_id)
