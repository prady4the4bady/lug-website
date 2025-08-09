
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";
import type { User, UserActivity } from "@/lib/types";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Loader2 } from "lucide-react";


interface UserActivityDialogProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function UserActivityDialog({ user, isOpen, onOpenChange }: UserActivityDialogProps) {
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !user?.id) {
            setActivities([]);
            return;
        };

        setLoading(true);
        // The query was simplified by removing orderBy to avoid needing a composite index.
        // Sorting is now handled on the client side after data is fetched.
        const q = query(
            collection(db, "activities"), 
            where("userId", "==", user.id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const activitiesData = snapshot.docs.map(doc => doc.data() as UserActivity);
            // Sort activities by timestamp descending on the client.
            activitiesData.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
            setActivities(activitiesData);
            setLoading(false);
        });

        return () => unsubscribe();

    }, [isOpen, user?.id]);

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
                           {loading ? (
                               <TableRow>
                                   <TableCell colSpan={3} className="h-24 text-center">
                                       <Loader2 className="h-6 w-6 animate-spin" />
                                   </TableCell>
                               </TableRow>
                           ) : activities.length > 0 ? (
                               activities.map((activity, index) => (
                                   <TableRow key={index}>
                                       <TableCell>
                                           <Badge variant="outline">{activity.action}</Badge>
                                       </TableCell>
                                       <TableCell>{activity.details}</TableCell>
                                       <TableCell className="text-muted-foreground">
                                           {activity.timestamp ? format(activity.timestamp.toDate(), "PPP p") : '...'}
                                       </TableCell>
                                   </TableRow>
                               ))
                           ) : (
                                <TableRow>
                                   <TableCell colSpan={3} className="h-24 text-center">
                                       No activity recorded.
                                   </TableCell>
                               </TableRow>
                           )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
