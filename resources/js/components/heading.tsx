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
                variant === 'small'
                    ? 'min-w-0 space-y-1'
                    : 'min-w-0 max-w-3xl space-y-1'
            }
        >
            <h1
                className={
                    variant === 'small'
                        ? 'break-words text-base font-medium'
                        : 'break-words text-xl font-semibold tracking-tight min-[360px]:text-2xl'
                }
            >
                {title}
            </h1>
            {description && (
                <p className="max-w-2xl break-words text-sm leading-6 text-muted-foreground">
                    {description}
                </p>
            )}
        </header>
    );
}
