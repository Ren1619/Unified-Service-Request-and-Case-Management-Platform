import type { Region } from './region';

export type ContactGroupSummary = {
    id: number;
    name: string;
};

export type ContactRegionSummary = Pick<Region, 'id' | 'code' | 'name'>;

export type Contact = {
    id: number;
    name: string;
    mobile_number: string | null;
    phone_number: string | null;
    email: string | null;
    organization: string | null;
    position: string | null;
    region_id: number | null;
    region?: ContactRegionSummary | null;
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
