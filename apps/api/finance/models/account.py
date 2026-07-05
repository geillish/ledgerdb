from decimal import Decimal

from django.db import models

from core.models import TimeStampedModel, UUIDModel
from finance.choices import AccountType

from .institution import Institution


class Account(UUIDModel, TimeStampedModel):
    institution = models.ForeignKey(
        Institution,
        on_delete=models.PROTECT,
        related_name="accounts",
    )

    name = models.CharField(max_length=100)

    account_type = models.CharField(
        max_length=20,
        choices=AccountType.choices,
    )

    current_balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    notes = models.TextField(
        blank=True,
    )

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name
