
"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Event } from "@/lib/types";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EditProfileForm } from "./edit-profile-form";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/activity-logger";
import { UserActivityLog } from "./user-activity-log";

const useParticipatedEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // As a placeholder, we're fetching all events. 
        // In a real app, you'd query for events the user has *actually* attended.
        const q = query(collection(db, "events")); 
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => {
                 const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                } as Event
            });
            // For now, assume user attended all past events
            const pastEvents = eventsData.filter(e => e.date.toDate() < new Date());
            setEvents(pastEvents);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { events, loading: loading };
}


function EventHistoryTab() {
    const { user } = useAuth();
    const { events: participatedEvents, loading: eventsLoading } = useParticipatedEvents();
    
    if (eventsLoading) {
        return (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }

    return (
         <Card>
            <CardHeader>
                <CardTitle>Event Participation History</CardTitle>
                <CardDescription>A log of all the events you have attended.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {participatedEvents.map(event => (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.title}</TableCell>
                                <TableCell>{format(event.date.toDate(), "PPP")}</TableCell>
                            </TableRow>
                        ))}
                        {participatedEvents.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                    No past event history found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export function ProfileTabs() {
    const { user, dbUser, loading: authLoading } = useAuth();

    if (authLoading || !user) {
        return (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }
    
    const userName = user.displayName || "User";
    const userEmail = user.email || "No email provided";
    const userAvatar = user.photoURL || "https://placehold.co/100x100.png";
    const isCouncilMember = dbUser?.isCouncilMember || false;

    return (
        <Tabs defaultValue="dashboard" className="w-full">
            <div className="flex justify-center mb-6">
                <TabsList>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="history">Event History</TabsTrigger>
                    {isCouncilMember && <TabsTrigger value="edit-profile">Edit Profile</TabsTrigger>}
                </TabsList>
            </div>
            <TabsContent value="dashboard">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Profile</CardTitle>
                                <CardDescription>Your personal details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={userAvatar} alt="User Avatar" />
                                        <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-semibold">{userName}</h3>
                                        <p className="text-sm text-muted-foreground">{userEmail}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                               <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <h4 className="font-medium">Theme</h4>
                                        <p className="text-sm text-muted-foreground">Select your preferred theme.</p>
                                    </div>
                                    <ThemeToggle />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-2">
                         <UserActivityLog userId={user.uid} />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="history">
                <EventHistoryTab />
            </TabsContent>
            {isCouncilMember && (
                <TabsContent value="edit-profile">
                    <EditProfileForm user={dbUser} />
                </TabsContent>
            )}
        </Tabs>
    );
}
