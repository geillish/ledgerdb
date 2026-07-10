from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("finance", "0007_alter_recurringtransaction_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="transaction",
            name="recurring_transaction",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="generated_transactions",
                to="finance.recurringtransaction",
            ),
        ),
    ]
