export type Institution = {
    id: string;
    name: string;
    date_created: string;
    date_updated: string;
};

export type CreateInstitutionInput = {
    name: string;
};

export type UpdateInstitutionInput = CreateInstitutionInput;
