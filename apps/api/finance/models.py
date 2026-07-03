from django.db import models

from core.models import TimeStampedModel


class Institution(TimeStampedModel):
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name