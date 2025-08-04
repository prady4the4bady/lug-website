"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CertificateGenerator } from "@/components/profile/certificate-generator";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Event } from "@/lib/types";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const participatedEvents: Event[] = [
  { id: "1", title: "Intro to Linux Workshop", description: "Learned the basics of the Linux command line.", date: new Date(2023, 10, 15) },
  { id: "2", title: "Python Scripting Session", description: "Automated tasks with Python scripts.", date: new Date(2023, 9, 20) },
];


export function ProfileTabs() {
    return (
        <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="history">Event History</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
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
                                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-xl font-semibold">User Name</h3>
                                <p className="text-sm text-muted-foreground">user.name@dubai.bits-pilani.ac.in</p>
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
                                        <TableCell>{format(event.date, "PPP")}</TableCell>
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
                <CertificateGenerator events={participatedEvents} userName="User Name" />
            </TabsContent>
        </Tabs>
    );
}
