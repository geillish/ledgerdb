from decimal import Decimal

from django.db import models

from core.models import TimeStampedModel, UUIDModel

from .account import Account


class Goal(UUIDModel, TimeStampedModel):
    account = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="goals",
    )

    name = models.CharField(max_length=100)

    target_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    target_date = models.DateField(
        null=True,
        blank=True,
    )

    notes = models.TextField(
        blank=True,
    )

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str:
        return self.name
