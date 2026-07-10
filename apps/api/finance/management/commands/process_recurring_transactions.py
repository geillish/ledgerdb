from datetime import date

from django.core.management.base import BaseCommand
from django.utils import timezone

from finance.recurring_processing import process_recurring_transactions


class Command(BaseCommand):
    help = "Create transactions for recurring payments that are due."

    def add_arguments(self, parser):
        parser.add_argument(
            "--date",
            help="Process as of this date (YYYY-MM-DD). Defaults to today.",
        )

    def handle(self, *args, **options):
        reference_date = date.fromisoformat(options["date"]) if options["date"] else timezone.localdate()
        created = process_recurring_transactions(reference_date)

        if created:
            self.stdout.write(
                self.style.SUCCESS(f"Created {len(created)} transaction(s) for {reference_date.isoformat()}.")
            )
            for transaction in created:
                self.stdout.write(f"  - {transaction.account.name}: {transaction.note or transaction.category}")
        else:
            self.stdout.write(f"No recurring payments due on {reference_date.isoformat()}.")
