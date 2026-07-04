from django.contrib import admin

from finance.models import Account


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "institution",
        "account_type",
        "opening_balance",
    )

    list_filter = (
        "institution",
        "account_type",
    )

    search_fields = (
        "name",
        "notes",
    )

    ordering = (
        "institution__name",
        "name",
    )
