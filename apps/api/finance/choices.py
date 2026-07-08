from django.db import models


class AccountType(models.TextChoices):
    CURRENT = "CURRENT", "Current"
    SAVINGS = "SAVINGS", "Savings"
    CREDIT_CARD = "CREDIT_CARD", "Credit Card"
    LOAN = "LOAN", "Loan"
    PENSION = "PENSION", "Pension"
    CRYPTO = "CRYPTO", "Crypto"
    CASH = "CASH", "Cash"


class TransactionCategory(models.TextChoices):
    SALARY = "SALARY", "Salary"
    OTHER_INCOME = "OTHER_INCOME", "Other"
    TRANSFER_IN = "TRANSFER_IN", "Transfer in"
    GROCERIES = "GROCERIES", "Groceries"
    RENT = "RENT", "Rent"
    MORTGAGE = "MORTGAGE", "Mortgage"
    BILLS = "BILLS", "Bills"
    TRANSPORT = "TRANSPORT", "Transport"
    SHOPPING = "SHOPPING", "Shopping"
    DINING = "DINING", "Dining Out"
    HEALTH = "HEALTH", "Health"
    ENTERTAINMENT = "ENTERTAINMENT", "Entertainment"
    SAVINGS = "SAVINGS", "Savings"
    PENSION = "PENSION", "Pension"
    INVESTMENT = "INVESTMENT", "Investment"
    TRANSFER_OUT = "TRANSFER_OUT", "Transfer out"
    OTHER = "OTHER", "Other expense"
