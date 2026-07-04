from django.contrib import admin

from finance.models import Goal


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "account",
        "target_amount",
        "target_date",
    )

    list_filter = (
        "account",
    )

    search_fields = (
        "name",
        "notes",
    )

    ordering = (
        "name",
    )