
"use client"

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/lib/types";
import { format } from "date-fns";
import { ExternalLink, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { ScrollArea } from "./ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

export function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
        } as Event
      });
      setEvents(eventsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const eventDates = events.map(e => e.date.toDate());

  const eventsForSelectedDay = date
    ? events.filter(event => format(event.date.toDate(), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-0 flex justify-center">
             <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-3"
              modifiers={{
                events: eventDates
              }}
              modifiersStyles={{
                events: {
                  color: 'hsl(var(--primary-foreground))',
                  backgroundColor: 'hsl(var(--primary))'
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <h2 className="text-2xl font-headline font-bold mb-4">
          Events on {date ? format(date, "MMMM d, yyyy") : "..."}
        </h2>
        <ScrollArea className="h-[300px] md:h-[380px] pr-4">
          <div className="space-y-4">
            {loading ? (
               <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : eventsForSelectedDay.length > 0 ? (
              eventsForSelectedDay.map(event => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>{format(event.date.toDate(), "p")}</CardDescription>
                      </div>
                      <Badge variant="secondary">Upcoming</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{event.description}</p>
                  </CardContent>
                  {event.link && (
                    <CardFooter>
                      <Button asChild variant="link" className="p-0 h-auto">
                        <a href={event.link} target="_blank" rel="noopener noreferrer">
                          Event Details <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 h-40 flex items-center justify-center">
                  <p className="text-muted-foreground">No events scheduled for this day.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
