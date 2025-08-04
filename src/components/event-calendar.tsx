"use client"

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/lib/types";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";

// Mock data
const mockEvents: Event[] = [
  { id: "1", title: "Intro to Linux Workshop", description: "Learn the basics of the Linux command line.", date: new Date(new Date().setDate(new Date().getDate() + 2)), link: "#" },
  { id: "2", title: "Python Scripting Session", description: "Automate tasks with Python scripts.", date: new Date(new Date().setDate(new Date().getDate() + 7)), link: "#" },
  { id: "3", title: "Guest Talk: DevOps with Kubernetes", description: "An industry expert shares insights.", date: new Date(new Date().setDate(new Date().getDate() + 7)), link: "#" },
  { id: "4", title: "Arch Linux Install Fest", description: "Install Arch Linux with help from experienced users.", date: new Date(new Date().setDate(new Date().getDate() + 15)), link: "#" },
];

export function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const eventsForSelectedDay = date
    ? mockEvents.filter(event => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
    : [];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-0">
             <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-3"
              modifiers={{
                events: mockEvents.map(e => e.date)
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
        <div className="space-y-4">
          {eventsForSelectedDay.length > 0 ? (
            eventsForSelectedDay.map(event => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>{format(event.date, "p")}</CardDescription>
                    </div>
                    <Badge variant="secondary">Upcoming</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{event.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="link" className="p-0 h-auto">
                    <a href={event.link} target="_blank" rel="noopener noreferrer">
                      Event Details <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No events scheduled for this day.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
