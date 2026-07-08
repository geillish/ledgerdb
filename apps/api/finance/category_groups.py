from finance.choices import TransactionCategory

INCOME_CATEGORIES = frozenset(
    {
        TransactionCategory.SALARY,
        TransactionCategory.OTHER_INCOME,
        TransactionCategory.TRANSFER_IN,
    }
)

TRANSFER_CATEGORIES = frozenset(
    {
        TransactionCategory.TRANSFER_IN,
        TransactionCategory.TRANSFER_OUT,
    }
)

EXCLUDED_FROM_SPENDING = INCOME_CATEGORIES | {TransactionCategory.TRANSFER_OUT}
