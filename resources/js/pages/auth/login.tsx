import { Form, Head, usePage } from '@inertiajs/react';
import { Building2, LockKeyhole, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import AppLogoIcon from '@/components/app-logo-icon';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const { name } = usePage().props;

    return (
        <>
            <Head title="Sign in" />

            <main className="grid min-h-svh bg-background text-foreground lg:grid-cols-[minmax(0,1fr)_480px]">
                <section className="relative hidden overflow-hidden border-r border-border bg-sidebar text-sidebar-foreground lg:block">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--sidebar)_0%,var(--sidebar-accent)_48%,var(--bafe-green-dark)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(0deg,color-mix(in_oklch,var(--bafe-gold)_18%,transparent),transparent)]" />

                    <div className="relative z-10 flex min-h-svh flex-col justify-between p-12">
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                                <AppLogoIcon className="size-7 fill-current" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold tracking-normal text-white">
                                    {name}
                                </p>
                                <p className="text-xs text-white/68">
                                    Secure access portal
                                </p>
                            </div>
                        </div>

                        <div className="max-w-2xl">
                            <h1 className="max-w-xl text-4xl leading-tight font-semibold text-white">
                                Manage service requests with clarity, control,
                                and accountability.
                            </h1>
                            <p className="mt-5 max-w-lg text-base leading-7 text-white/72">
                                Centralized intake, tracking, communication, and
                                reporting for teams handling constituent service
                                cases.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="flex min-h-svh items-center justify-center px-6 py-10 sm:px-8">
                    <div className="w-full max-w-[420px]">
                        <div className="mb-9 flex items-center gap-3 lg:hidden">
                            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                                <AppLogoIcon className="size-6 fill-current" />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                    {name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Secure access portal
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
                            <div className="mb-7 space-y-2">
                                <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <LockKeyhole className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-semibold">
                                        Sign in
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        Enter your credentials to continue to
                                        the case management platform.
                                    </p>
                                </div>
                            </div>

                            {status && (
                                <div className="mb-5 rounded-md border border-primary/20 bg-primary/8 px-4 py-3 text-sm font-medium text-primary">
                                    {status}
                                </div>
                            )}

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                disableWhileProcessing
                                className="flex flex-col gap-5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-5">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">
                                                    Email address
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="email"
                                                        placeholder="name@agency.gov"
                                                        className="h-11 pl-9"
                                                        aria-invalid={
                                                            !!errors.email
                                                        }
                                                    />
                                                </div>
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <div className="flex items-center gap-3">
                                                    <Label htmlFor="password">
                                                        Password
                                                    </Label>
                                                    {canResetPassword && (
                                                        <TextLink
                                                            href={request()}
                                                            className="ml-auto text-sm text-primary decoration-primary/30 hover:decoration-primary!"
                                                            tabIndex={5}
                                                        >
                                                            Forgot password?
                                                        </TextLink>
                                                    )}
                                                </div>
                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Enter your password"
                                                    className="h-11"
                                                    aria-invalid={
                                                        !!errors.password
                                                    }
                                                />
                                                <InputError
                                                    message={errors.password}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        id="remember"
                                                        name="remember"
                                                        tabIndex={3}
                                                    />
                                                    <Label
                                                        htmlFor="remember"
                                                        className="text-sm text-muted-foreground"
                                                    >
                                                        Remember this device
                                                    </Label>
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="h-11 w-full"
                                                tabIndex={4}
                                                disabled={processing}
                                                data-test="login-button"
                                            >
                                                {processing ? (
                                                    <Spinner />
                                                ) : (
                                                    <Building2 className="size-4" />
                                                )}
                                                Sign in
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>

                        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
                            Access is managed by authorized administrators.
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
