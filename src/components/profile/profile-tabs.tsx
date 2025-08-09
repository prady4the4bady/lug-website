
"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Event, SubscriptionTier } from "@/lib/types";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Download, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, Timestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EditProfileForm } from "./edit-profile-form";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/activity-logger";
import { UserActivityLog } from "./user-activity-log";
import { generateCertificate } from "@/lib/certificate-generator";

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
    const { toast } = useToast();
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    const handleGetCertificate = async (event: Event) => {
        if (!user) return;
        setGeneratingId(event.id);
        try {
            await generateCertificate({
                name: user.displayName || "LUG Member",
                event: event.title,
                date: format(event.date.toDate(), "MMMM d, yyyy")
            });
            await logActivity(user.uid, "Certificate Generated", `Downloaded certificate for event: ${event.title}`);
        } catch (error) {
            toast({
                title: "Generation Failed",
                description: "There was a problem generating your certificate. Please try again.",
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
                                        onClick={() => handleGetCertificate(event)}
                                        disabled={generatingId === event.id}
                                    >
                                        {generatingId === event.id ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Download className="mr-2 h-4 w-4" />
                                        )}
                                        Get Certificate
                                    </Button>
                                </TableCell>
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

function MembershipTab() {
    const { user, dbUser } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubscription = async (tier: SubscriptionTier) => {
        if (!user || !dbUser) return;
        setIsSubmitting(true);
        
        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                subscriptionStatus: 'pending',
                subscriptionTier: tier
            });
            await logActivity(user.uid, 'Subscription Selected', `User selected the ${tier} plan.`);
             toast({
                title: 'Subscription Pending',
                description: 'Please contact a council member to complete your payment.',
            });
        } catch (error) {
            toast({
                title: 'Subscription Failed',
                description: 'Could not update your subscription status. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!dbUser) {
        return <Loader2 className="h-8 w-8 animate-spin" />;
    }
    
    if (dbUser.subscriptionStatus === 'active') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Active Member</CardTitle>
                    <CardDescription>Your membership is currently active.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4 text-green-500">
                    <CheckCircle className="h-10 w-10" />
                    <div>
                        <p className="font-bold text-lg">You have full access to all member benefits.</p>
                        <p>Your subscription tier: {dbUser.subscriptionTier}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    if (dbUser.subscriptionStatus === 'pending') {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Payment Pending</CardTitle>
                    <CardDescription>Your membership is awaiting payment confirmation.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4 text-amber-500">
                    <Clock className="h-10 w-10" />
                    <div>
                        <p className="font-bold text-lg">Please contact a council member to complete your payment for the {dbUser.subscriptionTier} plan.</p>
                        <p>Once confirmed, you will gain access to member-only features.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Semester Membership</CardTitle>
                    <CardDescription>Access for the current semester.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold mb-4">AED 25</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Access to all workshops</li>
                        <li>Priority for limited-seat events</li>
                        <li>Access to the community forum</li>
                    </ul>
                </CardContent>
                <CardContent>
                    <Button className="w-full" onClick={() => handleSubscription('Semester')} disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Choose Semester Plan
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Annual Membership</CardTitle>
                    <CardDescription>Full access for the entire academic year.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-3xl font-bold mb-4">AED 40</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>All Semester benefits</li>
                        <li>Exclusive access to archived content</li>
                        <li>A cool LUG sticker pack!</li>
                    </ul>
                </CardContent>
                <CardContent>
                    <Button className="w-full" onClick={() => handleSubscription('Annual')} disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Choose Annual Plan
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
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
    const isActiveMember = dbUser?.subscriptionStatus === 'active';

    return (
        <Tabs defaultValue="dashboard" className="w-full">
            <div className="flex justify-center mb-6">
                <TabsList>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="membership">Membership</TabsTrigger>
                    {isActiveMember && <TabsTrigger value="history">Event History</TabsTrigger>}
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
            <TabsContent value="membership">
                <MembershipTab />
            </TabsContent>
            {isActiveMember && (
                <TabsContent value="history">
                    <EventHistoryTab />
                </TabsContent>
            )}
            {isCouncilMember && (
                <TabsContent value="edit-profile">
                    <EditProfileForm user={dbUser} />
                </TabsContent>
            )}
        </Tabs>
    );
}
