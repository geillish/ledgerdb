from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from finance.balances import sync_account_balance, sync_accounts_for_transaction
from finance.models import Transaction


@receiver(pre_save, sender=Transaction)
def cache_previous_transaction(_sender, instance, **_kwargs):
    if instance.pk:
        instance._balance_previous = Transaction.objects.select_related("account").filter(pk=instance.pk).first()
    else:
        instance._balance_previous = None


@receiver(post_save, sender=Transaction)
def sync_account_balance_on_transaction_save(_sender, instance, created, **_kwargs):
    previous = getattr(instance, "_balance_previous", None)
    previous_account_id = previous.account_id if previous else None

    sync_accounts_for_transaction(
        current_account_id=instance.account_id,
        previous_account_id=None if created else previous_account_id,
    )


@receiver(post_delete, sender=Transaction)
def sync_account_balance_on_transaction_delete(_sender, instance, **_kwargs):
    sync_account_balance(instance.account_id)
