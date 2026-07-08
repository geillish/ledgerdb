import { Select } from '@/components/ui/select';
import { TRANSACTION_CATEGORY_GROUPS, renderTransactionCategoryLabel } from '@/lib/transaction';
import type { TransactionCategory } from '@/types/transaction';

type TransactionCategorySelectProps = {
    id: string;
    name?: string;
    required?: boolean;
    defaultValue?: TransactionCategory | '';
};

export function TransactionCategorySelect({ id, name = 'category', required, defaultValue = 'GROCERIES' }: TransactionCategorySelectProps) {
    return (
        <Select id={id} name={name} required={required} defaultValue={defaultValue}>
            {TRANSACTION_CATEGORY_GROUPS.map(group => (
                <optgroup key={group.label} label={group.label}>
                    {group.categories.map(category => (
                        <option key={category} value={category}>
                            {renderTransactionCategoryLabel(category)}
                        </option>
                    ))}
                </optgroup>
            ))}
        </Select>
    );
}
