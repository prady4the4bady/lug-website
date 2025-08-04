
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateEventCertificate } from '@/ai/flows/generate-event-certificate';
import type { Event } from '@/lib/types';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';

interface CertificateGeneratorProps {
  events: Event[];
  userName: string;
}

const CERTIFICATE_TEMPLATE_URI = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTE5MCIgaGVpZ2h0PSI4NDIiIHZpZXdCb3g9IjAgMCAxMTkwIDg0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjExOTAiIGhlaWdodD0iODQyIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIxMTUwIiBoZWlnaHQ9IjgwMiIgcng9IjEwIiBmaWxsPSJub25lIiBzdHJva2U9IiNEMjlCMjIiIHN0cm9rZS13aWR0aD0iMiIvPgo8cmVjdCB4PSIyMiIgeT0iMjIiIHdpZHRoPSIxMTQ2IiBoZWlnaHQ9Ijc5OCIgcng9IjEwIiBmaWxsPSJub25lIiBzdHJva2U9IiNEMjlCMjIiIHN0cm9rZS13aWR0aD0iNiIvPgo8cGF0aCBkPSJNODAgMjA4QzgwIDIyMy40NjQgOTIuNTM2IDI1NyAxMDggMjU3QzEyMy40NjQgMjU3IDE1NyAyNDQuNDY0IDE1NyAyMjJDMTU3IDE5OS41MzYgMTIzLjQ2NCAxODcgMTA4IDE4N0M5Mi41MzYgMTg3IDgwIDE5Mi41MzYgODAgMjA4WiIgZmlsbD0iI0QyOUIyMiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPHBhdGggZD0iTTEwNTcgNjY1QzEwNTcgNjQ5LjU3IDEwNDQuNDYgNjE2IDEwMjkgNjE2QzEwMTMuNTQgNjE2IDk4MCA2MjguNTcgOTgwIDY1MUM5ODAgNzczLjQzIDEwMTMuNTQgNjg2IDEwMjkgNjg2QzEwNDQuNDYgNjg2IDEwNTcgNjgwLjQzIDEwNTcgNjY1WiIgZmlsbD0iI0QyOUIyMiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPHRleHQgeD0iNTAlIiB5PSI5MCIgZm9udC1mYW1pbHk9IkhlbHZldGljYSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q0VSVElGSUNBVEUgT0YgUEFSVElDSVBBVElPTjwvdGV4dD4KPHRleHQgeD0iNTAlIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJIZWx2ZXRpY2EsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM1MzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRoaXMgaXMgdG8gY2VydGlmeSB0aGF0PC90ZXh0Pgo8dGV4dCB4PSI1MCUiIHk9IjI1MCIgZm9udC1mYW1pbHk9IkdyZWF0IFZpYmVzLCBjdXJzaXZlIiBmb250LXNpemU9IjYwIiBmaWxsPSIjRDI5QjIyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5VU0VSX05BTUVfSEVSRTwvdGV4dD4KPHRleHQgeD0iNTAlIiB5PSIzMTAiIGZvbnQtZmFtaWx5PSJIZWx2ZXRpY2EsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM1MzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhhcyBzdWNjZXNzZnVsbHkgY29tcGxldGVkIHRoZTwvdGV4dD4KPHRleHQgeD0iNTAlIiB5PSI0MDAiIGZvbnQtZmFtaWx5PSJIZWx2ZXRpY2EsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDIiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVWRU5UX05BTUVfSEVSRTwvdGV4dD4KPHRleHQgeD0iNTAlIiB5PSI0NjAiIGZvbnQtZmFtaWx5PSJIZWx2ZXRpY2EsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM1MzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPm9uPC90ZXh0Pgo8dGV4dCB4PSI1MCUiIHk9IjUyMCIgZm9udC1mYW1pbHk9IkhlbHZldGljYSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyOCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RVZFTlRfREFURV9IRVJFPC90ZXh0Pgo8bGluZSB4MT0iMjAwIiB5MT0iNjgwIiB4Mj0iNTAwIiB5Mj0iNjgwIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSIvPgo8dGV4dCB4PSIzNTAlIiB5PSI3MTAiIGZvbnQtZmFtaWx5PSJIZWx2ZXRpY2EsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxVRyBQcmVzaWRlbnQ8L3RleHQ+CjxsaW5lIHgxPSI2OTAiIHkxPSI2ODAiIHgyPSI5OTAiIHkyPSI2ODAiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjx0ZXh0IHg9Ijg0MCUiIHk9IjcxMCIgZm9udC1mYW1pbHk9IkhlbHZldGljYSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXZlbnQgQ29vcmRpbmF0b3I8L3RleHQ+Cjwvc3ZnPgo=`;


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
      const fileExtension = result.certificateDataUri.split(';')[0].split('/')[1] || 'png';
      link.download = `Certificate_${event.title.replace(/\s/g, '_')}.${fileExtension}`;
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
