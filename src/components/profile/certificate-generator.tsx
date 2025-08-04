
"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Download } from "lucide-react";
import type { Event, User } from '@/lib/types';
import { generateEventCertificate } from '@/ai/flows/generate-event-certificate';
import { useToast } from '@/hooks/use-toast';

interface CertificateGeneratorProps {
    events: Event[];
    user: User | null;
}

export function CertificateGenerator({ events, user }: CertificateGeneratorProps) {
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerateCertificate = async () => {
        if (!selectedEventId || !user) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select an event and make sure you are logged in.",
            });
            return;
        }

        setIsLoading(true);

        const selectedEvent = events.find(e => e.id === selectedEventId);
        if (!selectedEvent) return;

        try {
            const result = await generateEventCertificate({
                eventName: selectedEvent.title,
                userName: user.name,
            });

            if (result.certificateDataUri) {
                const link = document.createElement("a");
                link.href = result.certificateDataUri;
                link.download = `LUG_Certificate_${user.name}_${selectedEvent.title}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                 toast({
                    variant: "destructive",
                    title: "Generation Failed",
                    description: "Could not generate the certificate. Please try again later.",
                });
            }

        } catch (error) {
            console.error("Certificate generation error:", error);
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: "An unexpected error occurred. Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Event Certificates</CardTitle>
                <CardDescription>Generate and download certificates for events you have participated in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Select onValueChange={setSelectedEventId} value={selectedEventId}>
                        <SelectTrigger className="w-full md:w-1/2">
                            <SelectValue placeholder="Select an event" />
                        </SelectTrigger>
                        <SelectContent>
                            {events.map(event => (
                                <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <Button onClick={handleGenerateCertificate} disabled={isLoading || !selectedEventId}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-4 w-4" />
                            Generate & Download
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}

