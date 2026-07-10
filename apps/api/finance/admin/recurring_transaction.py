from django.contrib import admin

from finance.models import RecurringTransaction


@admin.register(RecurringTransaction)
class RecurringTransactionAdmin(admin.ModelAdmin):
    list_display = ("note", "account", "category", "amount", "day_of_month", "is_active")
    list_filter = ("is_active", "category", "account")
    search_fields = ("note", "account__name")
