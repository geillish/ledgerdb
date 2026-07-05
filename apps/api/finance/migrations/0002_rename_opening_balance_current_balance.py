from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("finance", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="account",
            old_name="opening_balance",
            new_name="current_balance",
        ),
    ]
