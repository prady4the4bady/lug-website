
"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CertificateGenerator } from "@/components/profile/certificate-generator";
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

// This is just an example. In a real app, you'd fetch events the user has *actually* attended.
// This might involve a subcollection on the user document or a separate 'attendance' collection.
// For now, we'll just fetch all events and pretend the user attended them for demonstration.
const useParticipatedEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, you would query based on the logged-in user's ID
        const q = query(collection(db, "events")); 
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

    return { events, loading: loading };
}


export function ProfileTabs() {
    const { user, dbUser, loading: authLoading } = useAuth();
    const { events: participatedEvents, loading: eventsLoading } = useParticipatedEvents();

    if (authLoading || eventsLoading) {
        return (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }
    
    const userName = user?.displayName || "User";
    const userEmail = user?.email || "No email provided";
    const userAvatar = user?.photoURL || "https://placehold.co/100x100.png";
    const isCouncilMember = dbUser?.isCouncilMember || false;

    return (
        <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className={`grid w-full grid-cols-${isCouncilMember ? 4 : 3}`}>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="history">Event History</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                {isCouncilMember && <TabsTrigger value="edit-profile">Edit Profile</TabsTrigger>}
            </TabsList>
            <TabsContent value="dashboard">
                <Card>
                    <CardHeader>
                        <CardTitle>My Profile</CardTitle>
                        <CardDescription>View and manage your personal details and settings.</CardDescription>
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
                        <div className="space-y-2">
                           <CardTitle className="text-lg">Settings</CardTitle>
                           <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <h4 className="font-medium">Theme</h4>
                                    <p className="text-sm text-muted-foreground">Select your preferred interface theme.</p>
                                </div>
                                <ThemeToggle />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="history">
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
                                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                                            No event history found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="certificates">
                <CertificateGenerator events={participatedEvents} userName={userName} />
            </TabsContent>
            {isCouncilMember && (
                <TabsContent value="edit-profile">
                    <EditProfileForm user={dbUser} />
                </TabsContent>
            )}
        </Tabs>
    );
}
