from decimal import Decimal

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from core.models import TimeStampedModel, UUIDModel

from finance.choices import TransactionCategory

from .account import Account


class RecurringTransaction(UUIDModel, TimeStampedModel):
    account = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="recurring_transactions",
    )

    category = models.CharField(
        max_length=20,
        choices=TransactionCategory.choices,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    note = models.CharField(
        max_length=200,
        blank=True,
    )

    day_of_month = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(28)],
    )

    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        ordering = ["day_of_month", "note", "date_created"]

    def __str__(self) -> str:
        return f"{self.note or self.category} (day {self.day_of_month})"
