from decimal import Decimal

from django.db import migrations

from finance.balances import transaction_balance_delta


def apply_existing_transaction_balances(apps, schema_editor):
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

        if delta_sum != 0:
            account.current_balance = Decimal(account.current_balance) + delta_sum
            account.save(update_fields=["current_balance"])


class Migration(migrations.Migration):
    dependencies = [
        ("finance", "0002_rename_opening_balance_current_balance"),
    ]

    operations = [
        migrations.RunPython(
            apply_existing_transaction_balances,
            migrations.RunPython.noop,
        ),
    ]
