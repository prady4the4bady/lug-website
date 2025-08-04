import { EventCalendar } from "@/components/event-calendar";

export default function EventsPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Club Events</h1>
        <p className="text-lg text-muted-foreground mt-2">Join our workshops, talks, and meetups.</p>
      </div>
      <EventCalendar />
    </div>
  );
}
