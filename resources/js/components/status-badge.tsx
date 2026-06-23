import { Badge } from '@/components/ui/badge';

export default function StatusBadge({ active }: { active: boolean }) {
    return (
        <Badge variant={active ? 'secondary' : 'outline'}>
            {active ? 'Active' : 'Inactive'}
        </Badge>
    );
}
