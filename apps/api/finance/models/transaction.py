from decimal import Decimal

from django.db import models

from core.models import TimeStampedModel, UUIDModel

from finance.choices import TransactionCategory

from .account import Account


class Transaction(UUIDModel, TimeStampedModel):
    account = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="transactions",
    )

    transaction_date = models.DateField()

    category = models.CharField(
        max_length=20,
        choices=TransactionCategory.choices,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    note = models.TextField(
        blank=True,
    )

    class Meta:
        ordering = ["-transaction_date", "-date_created"]

    def __str__(self) -> str:
        return f"{self.account} ({self.amount})"
