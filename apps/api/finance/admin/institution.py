from django.contrib import admin

from finance.models import Institution


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "date_created",
        "date_updated",
    )

    ordering = ("name",)
    search_fields = ("name",)
