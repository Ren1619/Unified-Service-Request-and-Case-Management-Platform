export type ContactGroupSummary = {
    id: number;
    name: string;
};

export type Contact = {
    id: number;
    name: string;
    mobile_number: string | null;
    phone_number: string | null;
    email: string | null;
    organization: string | null;
    position: string | null;
    notes: string | null;
    is_active: boolean;
    created_at: string | null;
    updated_at: string | null;
    groups?: ContactGroupSummary[];
};

export type ContactGroup = {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    contacts_count?: number;
    created_at: string | null;
    updated_at: string | null;
    contacts?: Contact[];
};
