"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateEventCertificate } from '@/ai/flows/generate-event-certificate';
import type { Event } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';

interface CertificateGeneratorProps {
  events: Event[];
  userName: string;
}

// Placeholder for the certificate template (as a base64 data URI)
const CERTIFICATE_TEMPLATE_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";


export function CertificateGenerator({ events, userName }: CertificateGeneratorProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedEventId) {
      setError("Please select an event.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const event = events.find(e => e.id === selectedEventId);
      if (!event) throw new Error("Event not found.");

      const result = await generateEventCertificate({
        userName: userName,
        eventName: event.title,
        eventDate: format(event.date, "PPP"),
        certificateTemplate: CERTIFICATE_TEMPLATE_URI,
      });

      const link = document.createElement('a');
      link.href = result.certificateDataUri;
      link.download = `Certificate_${event.title.replace(/\s/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificate Generation</CardTitle>
        <CardDescription>Generate and download your participation certificates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <Select onValueChange={setSelectedEventId} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {events.map(event => (
              <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
         {isLoading && (
            <div className="flex items-center space-x-2">
                <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Generating your certificate... this may take a moment.</p>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerate} disabled={isLoading || !selectedEventId}>
          {isLoading ? "Generating..." : "Download Certificate"}
        </Button>
      </CardFooter>
    </Card>
  );
}
