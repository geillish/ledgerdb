from django.contrib import admin

from .models import Institution


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "date_created",
        "date_updated",
    )

    search_fields = ("name",)
    ordering = ("name",)