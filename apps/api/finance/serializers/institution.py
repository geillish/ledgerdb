from rest_framework import serializers

from finance.models import Institution


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = "__all__"

    def validate_name(self, value: str) -> str:
        name = value.strip()

        if not name:
            raise serializers.ValidationError("Name cannot be empty.")

        queryset = Institution.objects.filter(name__iexact=name)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError("An institution with this name already exists.")

        return name
