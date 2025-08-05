
"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Event, User } from "@/lib/types";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EditProfileForm } from "./edit-profile-form";
import { Button } from "../ui/button";
import { generateCertificate } from "@/ai/flows/generate-certificate-flow";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/activity-logger";

const useParticipatedEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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


function EventHistoryTab() {
    const { user } = useAuth();
    const { events: participatedEvents, loading: eventsLoading } = useParticipatedEvents();
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const { toast } = useToast();

    const handleGenerateCertificate = async (event: Event) => {
        if (!user) return;
        setGeneratingId(event.id);
        try {
            const result = await generateCertificate({
                userName: user.displayName || "LUG Member",
                eventTitle: event.title,
                eventDate: format(event.date.toDate(), "PPP"),
            });

            await logActivity(user.uid, "Certificate Downloaded", `Downloaded certificate for event: ${event.title}`);
            
            const link = document.createElement('a');
            link.href = result.certificateDataUri;
            link.download = `LUG_Certificate_${event.title.replace(/\s/g, '_')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            toast({
                title: "Certificate Generation Failed",
                description: "There was an error creating your certificate. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setGeneratingId(null);
        }
    };
    
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
                            <TableHead className="text-right">Certificate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {participatedEvents.map(event => (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.title}</TableCell>
                                <TableCell>{format(event.date.toDate(), "PPP")}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                      size="sm"
                                      onClick={() => handleGenerateCertificate(event)}
                                      disabled={generatingId === event.id}
                                    >
                                        {generatingId === event.id ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Download className="mr-2 h-4 w-4" />
                                        )}
                                        {generatingId === event.id ? 'Generating...' : 'Get Certificate'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {participatedEvents.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                    No event history found.
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

    if (authLoading) {
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
            <div className="flex justify-center">
                <TabsList>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="history">Event History</TabsTrigger>
                    {isCouncilMember && <TabsTrigger value="edit-profile">Edit Profile</TabsTrigger>}
                </TabsList>
            </div>
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
