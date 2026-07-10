from decimal import Decimal

from django.db import migrations, models

import django.core.validators


def set_default_include_in_spendable(apps, schema_editor):
    Account = apps.get_model("finance", "Account")
    spendable_types = {"CURRENT", "CASH"}

    for account in Account.objects.all():
        account.include_in_spendable = account.account_type in spendable_types
        account.save(update_fields=["include_in_spendable"])


class Migration(migrations.Migration):
    dependencies = [
        ("finance", "0005_expand_transaction_categories"),
    ]

    operations = [
        migrations.AddField(
            model_name="account",
            name="include_in_spendable",
            field=models.BooleanField(default=True),
        ),
        migrations.RunPython(
            set_default_include_in_spendable,
            migrations.RunPython.noop,
        ),
        migrations.CreateModel(
            name="RecurringTransaction",
            fields=[
                ("id", models.UUIDField(editable=False, primary_key=True, serialize=False)),
                ("date_created", models.DateTimeField(auto_now_add=True)),
                ("date_updated", models.DateTimeField(auto_now=True)),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("SALARY", "Salary"),
                            ("OTHER_INCOME", "Other"),
                            ("TRANSFER_IN", "Transfer in"),
                            ("GROCERIES", "Groceries"),
                            ("RENT", "Rent"),
                            ("MORTGAGE", "Mortgage"),
                            ("BILLS", "Bills"),
                            ("TRANSPORT", "Transport"),
                            ("SHOPPING", "Shopping"),
                            ("DINING", "Dining Out"),
                            ("HEALTH", "Health"),
                            ("ENTERTAINMENT", "Entertainment"),
                            ("SAVINGS", "Savings"),
                            ("PENSION", "Pension"),
                            ("INVESTMENT", "Investment"),
                            ("TRANSFER_OUT", "Transfer out"),
                            ("OTHER", "Other expense"),
                        ],
                        max_length=20,
                    ),
                ),
                (
                    "amount",
                    models.DecimalField(
                        decimal_places=2,
                        default=Decimal("0.00"),
                        max_digits=12,
                    ),
                ),
                ("note", models.CharField(blank=True, max_length=200)),
                (
                    "day_of_month",
                    models.PositiveSmallIntegerField(
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(28),
                        ]
                    ),
                ),
                ("is_active", models.BooleanField(default=True)),
                (
                    "account",
                    models.ForeignKey(
                        on_delete=models.deletion.PROTECT,
                        related_name="recurring_transactions",
                        to="finance.account",
                    ),
                ),
            ],
            options={
                "ordering": ["day_of_month", "note", "date_created"],
            },
        ),
    ]
