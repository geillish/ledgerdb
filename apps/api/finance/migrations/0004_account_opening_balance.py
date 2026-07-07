from decimal import Decimal

from django.db import migrations, models

from finance.balances import transaction_balance_delta


def initialize_opening_balances(apps, schema_editor):
    Account = apps.get_model("finance", "Account")
    Transaction = apps.get_model("finance", "Transaction")

    for account in Account.objects.all():
        delta_sum = Decimal("0.00")

        for transaction in Transaction.objects.filter(account_id=account.pk):
            delta_sum += transaction_balance_delta(
                account.account_type,
                transaction.category,
                transaction.amount,
            )

        if Transaction.objects.filter(account_id=account.pk).exists():
            account.opening_balance = Decimal(account.current_balance) - delta_sum
        else:
            account.opening_balance = Decimal(account.current_balance)

        account.current_balance = account.opening_balance + delta_sum
        account.save(update_fields=["opening_balance", "current_balance"])


class Migration(migrations.Migration):
    dependencies = [
        ("finance", "0003_apply_transaction_balances"),
    ]

    operations = [
        migrations.AddField(
            model_name="account",
            name="opening_balance",
            field=models.DecimalField(
                decimal_places=2,
                default=Decimal("0.00"),
                max_digits=12,
            ),
        ),
        migrations.RunPython(
            initialize_opening_balances,
            migrations.RunPython.noop,
        ),
    ]
