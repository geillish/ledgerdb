from django.db import migrations, models


def migrate_transfer_category(apps, schema_editor):
    Transaction = apps.get_model("finance", "Transaction")
    Transaction.objects.filter(category="TRANSFER").update(category="TRANSFER_OUT")


class Migration(migrations.Migration):
    dependencies = [
        ("finance", "0004_account_opening_balance"),
    ]

    operations = [
        migrations.RunPython(
            migrate_transfer_category,
            migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name="transaction",
            name="category",
            field=models.CharField(
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
    ]
