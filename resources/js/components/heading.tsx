export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    return (
        <header
            className={
                variant === 'small' ? 'space-y-1' : 'max-w-3xl space-y-1'
            }
        >
            <h1
                className={
                    variant === 'small'
                        ? 'text-base font-medium'
                        : 'text-2xl font-semibold tracking-tight'
                }
            >
                {title}
            </h1>
            {description && (
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                    {description}
                </p>
            )}
        </header>
    );
}
