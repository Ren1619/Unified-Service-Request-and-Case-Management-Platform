export type Role = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    is_system: boolean;
};

export type AccessUser = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    roles: Role[];
};
