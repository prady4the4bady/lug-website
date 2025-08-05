
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import type { UserActivity } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { format } from "date-fns";

interface UserActivityLogProps {
  userId: string;
}

export function UserActivityLog({ userId }: UserActivityLogProps) {
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const q = query(
            collection(db, "activities"), 
            where("userId", "==", userId),
            orderBy("timestamp", "desc"),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const activitiesData = snapshot.docs.map(doc => doc.data() as UserActivity);
            setActivities(activitiesData);
            setLoading(false);
        });

        return () => unsubscribe();

    }, [userId]);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of your recent actions on the site.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[450px]">
                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex justify-center items-center h-24">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : activities.length > 0 ? (
                            activities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground">{format(activity.timestamp.toDate(), "PPP p")}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-center items-center h-24">
                                <p className="text-muted-foreground">No activity recorded yet.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
