
"use client";

import { EventCalendar } from "@/components/event-calendar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  const { dbUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (dbUser?.subscriptionStatus !== 'active' && !dbUser?.isAdmin) {
    return (
      <div className="container py-12 md:py-20 text-center">
        <div className="max-w-md mx-auto">
          <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            The events page is a member-only benefit. Please subscribe to gain access.
          </p>
          <Button asChild>
            <Link href="/profile">View Subscription Plans</Link>
          </Button>
        </div>
      </div>
    );
  }
  
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
