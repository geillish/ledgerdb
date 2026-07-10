from calendar import monthrange
from datetime import date
from decimal import Decimal

from finance.choices import AccountType, TransactionCategory

INSTITUTIONS = (
    "Metro Credit Union",
    "Everyday Pay",
    "Horizon Investments",
)

ACCOUNTS = (
    {
        "name": "Main Current Account",
        "institution": "Everyday Pay",
        "account_type": AccountType.CURRENT,
        "opening_balance": Decimal("500.00"),
        "notes": "Day-to-day spending and salary",
    },
    {
        "name": "Emergency Savings",
        "institution": "Metro Credit Union",
        "account_type": AccountType.SAVINGS,
        "opening_balance": Decimal("1200.00"),
        "notes": "Three-month emergency buffer",
    },
    {
        "name": "Holiday Pot",
        "institution": "Metro Credit Union",
        "account_type": AccountType.SAVINGS,
        "opening_balance": Decimal("450.00"),
        "notes": "Summer trip fund",
    },
    {
        "name": "Laptop Pot",
        "institution": "Metro Credit Union",
        "account_type": AccountType.SAVINGS,
        "opening_balance": Decimal("200.00"),
        "notes": "Saving for a new work laptop",
    },
    {
        "name": "Everyday Card",
        "institution": "Everyday Pay",
        "account_type": AccountType.CREDIT_CARD,
        "opening_balance": Decimal("320.00"),
        "notes": "Credit card for online purchases",
    },
    {
        "name": "Pension Fund",
        "institution": "Horizon Investments",
        "account_type": AccountType.PENSION,
        "opening_balance": Decimal("8400.00"),
        "notes": "Long-term retirement savings",
    },
)

GOALS = (
    {
        "name": "Emergency fund",
        "account": "Emergency Savings",
        "target_amount": Decimal("5000.00"),
        "target_date": date(2026, 12, 31),
        "notes": "Build a three-month safety net",
    },
    {
        "name": "Summer holiday",
        "account": "Holiday Pot",
        "target_amount": Decimal("2000.00"),
        "target_date": date(2026, 8, 15),
        "notes": "Flights and accommodation",
    },
    {
        "name": "New laptop",
        "account": "Laptop Pot",
        "target_amount": Decimal("1500.00"),
        "target_date": date(2026, 11, 1),
        "notes": "Work machine upgrade",
    },
)

MONTHLY_TRANSFERS = (
    {"day": 2, "from_note": "Emergency savings", "to_account": "Emergency Savings", "amount": "200.00"},
    {"day": 2, "from_note": "Holiday savings", "to_account": "Holiday Pot", "amount": "100.00"},
    {"day": 2, "from_note": "Laptop savings", "to_account": "Laptop Pot", "amount": "75.00"},
)

CREDIT_CARD_EXPENSES = (
    (11, TransactionCategory.SHOPPING, "64.99", "Online order"),
    (19, TransactionCategory.DINING, "41.50", "Delivery"),
)


def month_end(year: int, month: int) -> int:
    return monthrange(year, month)[1]


def transaction_date(year: int, month: int, day: int) -> date:
    return date(year, month, min(day, month_end(year, month)))


MONTHLY_SEED_DATA = (
    {
        "year": 2026,
        "month": 2,
        "salary": "3400.00",
        "expenses": (
            (1, TransactionCategory.RENT, "1250.00", "Rent"),
            (5, TransactionCategory.GROCERIES, "265.40", "Weekly shop"),
            (8, TransactionCategory.BILLS, "188.50", "Electricity"),
            (12, TransactionCategory.TRANSPORT, "112.00", "Bus pass"),
            (15, TransactionCategory.DINING, "72.30", "Restaurant"),
            (22, TransactionCategory.ENTERTAINMENT, "38.00", "Cinema"),
        ),
    },
    {
        "year": 2026,
        "month": 3,
        "salary": "3500.00",
        "expenses": (
            (1, TransactionCategory.RENT, "1250.00", "Rent"),
            (4, TransactionCategory.GROCERIES, "298.20", "Weekly shop"),
            (9, TransactionCategory.BILLS, "205.00", "Internet + phone"),
            (14, TransactionCategory.SHOPPING, "145.99", "Clothes"),
            (18, TransactionCategory.TRANSPORT, "98.50", "Fuel"),
            (25, TransactionCategory.HEALTH, "55.00", "Pharmacy"),
        ),
    },
    {
        "year": 2026,
        "month": 4,
        "salary": "3500.00",
        "expenses": (
            (1, TransactionCategory.RENT, "1250.00", "Rent"),
            (6, TransactionCategory.GROCERIES, "312.80", "Weekly shop"),
            (10, TransactionCategory.BILLS, "221.40", "Utilities"),
            (16, TransactionCategory.DINING, "94.60", "Birthday dinner"),
            (20, TransactionCategory.ENTERTAINMENT, "62.00", "Concert tickets"),
            (27, TransactionCategory.TRANSPORT, "104.00", "Train tickets"),
        ),
    },
    {
        "year": 2026,
        "month": 5,
        "salary": "3600.00",
        "expenses": (
            (1, TransactionCategory.RENT, "1250.00", "Rent"),
            (3, TransactionCategory.GROCERIES, "287.15", "Weekly shop"),
            (11, TransactionCategory.BILLS, "198.75", "Insurance"),
            (15, TransactionCategory.SHOPPING, "210.00", "Home supplies"),
            (19, TransactionCategory.DINING, "48.90", "Takeaway"),
            (24, TransactionCategory.ENTERTAINMENT, "29.99", "Streaming"),
            (28, TransactionCategory.HEALTH, "42.50", "GP visit"),
        ),
    },
    {
        "year": 2026,
        "month": 6,
        "salary": "3500.00",
        "other_income": "150.00",
        "expenses": (
            (1, TransactionCategory.RENT, "1250.00", "Rent"),
            (7, TransactionCategory.GROCERIES, "305.60", "Weekly shop"),
            (9, TransactionCategory.BILLS, "215.30", "Broadband"),
            (13, TransactionCategory.TRANSPORT, "118.00", "Fuel"),
            (17, TransactionCategory.DINING, "67.40", "Lunch out"),
            (21, TransactionCategory.SHOPPING, "89.99", "Books"),
            (26, TransactionCategory.ENTERTAINMENT, "54.00", "Weekend plans"),
        ),
    },
    {
        "year": 2026,
        "month": 7,
        "salary": "3500.00",
        "expenses": (
            (1, TransactionCategory.RENT, "1250.00", "Rent"),
            (7, TransactionCategory.BILLS, "230.00", "Utilities"),
            (7, TransactionCategory.DINING, "50.00", "Lunch"),
            (7, TransactionCategory.ENTERTAINMENT, "20.00", "Streaming"),
        ),
    },
)

PENSION_CONTRIBUTIONS = (
    (date(2026, 2, 28), "250.00"),
    (date(2026, 3, 31), "250.00"),
    (date(2026, 4, 30), "250.00"),
    (date(2026, 5, 30), "250.00"),
    (date(2026, 6, 30), "250.00"),
    (date(2026, 7, 7), "250.00"),
)
