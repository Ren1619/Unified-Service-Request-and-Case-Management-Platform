import { Head } from '@inertiajs/react';
import { Send } from 'lucide-react';
import Heading from '@/components/heading';
import { PageHeader, PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { send } from '@/routes/messages';

export default function SendMessage() {
    return (
        <>
            <Head title="Send Message" />

            <PageShell>
                <PageHeader>
                <Heading
                    title="Send Message"
                    description="Compose outbound SMS messages for citizens, contacts, or contact groups."
                />
                </PageHeader>

                <div className="mx-auto w-full max-w-4xl rounded-lg border bg-card p-4 shadow-xs sm:p-5">
                    <form className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="recipient">Recipient</Label>
                                <Input
                                    id="recipient"
                                    placeholder="Mobile number, contact, or group"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="case_number">
                                    Related case
                                </Label>
                                <Input
                                    id="case_number"
                                    placeholder="Optional case number"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="message">Message</Label>
                            <textarea
                                id="message"
                                rows={7}
                                maxLength={480}
                                className="min-h-40 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                placeholder="Type the SMS body here."
                            />
                        </div>

                        <div className="flex flex-col gap-3 rounded-md border bg-muted/35 p-4 md:flex-row md:items-center md:justify-between">
                            <p className="text-sm leading-6 text-muted-foreground">
                                Messaging API integration is pending. Sending is
                                disabled until credentials and endpoints are
                                connected.
                            </p>
                            <Button type="button" disabled>
                                <Send aria-hidden className="size-4" />
                                Send message
                            </Button>
                        </div>
                    </form>
                </div>
            </PageShell>
        </>
    );
}

SendMessage.layout = {
    breadcrumbs: [
        {
            title: 'Messages',
            href: send(),
        },
    ],
};
