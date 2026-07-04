import { isAxiosError } from 'axios';

export type FieldErrors = Record<string, string[]>;

export function getApiFieldErrors(error: unknown): FieldErrors | null {
    if (!isAxiosError(error) || error.response?.status !== 400) {
        return null;
    }

    const data = error.response.data;

    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        return null;
    }

    const errors: FieldErrors = {};

    for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
            errors[key] = value.map(String);
        } else if (typeof value === 'string') {
            errors[key] = [value];
        }
    }

    return Object.keys(errors).length > 0 ? errors : null;
}

export function getApiErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const data = error.response?.data;

        if (typeof data === 'object' && data !== null && 'detail' in data) {
            return String(data.detail);
        }

        if (error.response?.status === 400) {
            return 'Please correct the errors below.';
        }
    }

    return 'Something went wrong. Please try again.';
}

export function fieldError(errors: FieldErrors | undefined, field: string): string | undefined {
    return errors?.[field]?.[0];
}

export function formDataToObject(formData: FormData): Record<string, string> {
    const values: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
            values[key] = value;
        }
    }

    return values;
}
