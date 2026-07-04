from django.contrib import admin

from finance.models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "transaction_date",
        "account",
        "category",
        "amount",
    )

    list_filter = (
        "category",
        "account",
    )

    search_fields = (
        "note",
    )

    ordering = (
        "-transaction_date",
    )