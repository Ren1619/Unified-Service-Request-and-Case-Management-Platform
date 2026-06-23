import { Badge } from '@/components/ui/badge';
import type { Role } from '@/types';

export default function RoleBadges({ roles }: { roles: Role[] }) {
    if (roles.length === 0) {
        return <span className="text-sm text-muted-foreground">No roles</span>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
                <Badge key={role.id} variant="secondary">
                    {role.name}
                </Badge>
            ))}
        </div>
    );
}
