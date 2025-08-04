
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";

type User = {
    id: string;
    name: string;
    email: string;
};

interface UserActivityDialogProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const mockActivity = [
    { action: "Logged In", timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), details: "IP: 192.168.1.1" },
    { action: "Posted Message", timestamp: new Date(new Date().setHours(new Date().getHours() - 5)), details: "Message ID: msg-123" },
    { action: "Downloaded Certificate", timestamp: new Date(new Date().setHours(new Date().getHours() - 3)), details: "Event: Python Workshop" },
    { action: "Updated Profile", timestamp: new Date(new Date().setHours(new Date().getHours() - 1)), details: "Changed theme to dark" },
    { action: "Logged Out", timestamp: new Date(), details: "Session duration: 4h 59m" },
];

export function UserActivityDialog({ user, isOpen, onOpenChange }: UserActivityDialogProps) {
    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Activity Log: {user.name}</DialogTitle>
                    <DialogDescription>
                        A log of recent activities for {user.email}.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-96">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {mockActivity.map((activity, index) => (
                               <TableRow key={index}>
                                   <TableCell>
                                       <Badge variant="outline">{activity.action}</Badge>
                                   </TableCell>
                                   <TableCell>{activity.details}</TableCell>
                                   <TableCell className="text-muted-foreground">{format(activity.timestamp, "PPP p")}</TableCell>
                               </TableRow>
                           ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

