
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartBar, RechartsPrimitive } from "@/components/ui/chart";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, Timestamp, limit, orderBy } from 'firebase/firestore';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import type { User, Event, ChatMessage } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const aggregateDataByMonth = (items: { createdAt?: Timestamp }[] | { date: Timestamp }[] | { timestamp: Timestamp | null }[], dateKey: 'createdAt' | 'date' | 'timestamp') => {
    const monthlyCounts: Record<string, number> = {};
    const now = new Date();
    
    // Initialize the last 5 months
    for (let i = 4; i >= 0; i--) {
        const month = subMonths(now, i);
        const monthStr = format(month, 'MMM');
        monthlyCounts[monthStr] = 0;
    }

    items.forEach(item => {
        // @ts-ignore
        const itemTimestamp = item[dateKey];
        if (itemTimestamp) {
            const itemDate = itemTimestamp.toDate();
            const fiveMonthsAgo = startOfMonth(subMonths(now, 4));
            const endOfThisMonth = endOfMonth(now);

            if (isWithinInterval(itemDate, { start: fiveMonthsAgo, end: endOfThisMonth })) {
                const monthStr = format(itemDate, 'MMM');
                if (monthStr in monthlyCounts) {
                    monthlyCounts[monthStr]++;
                }
            }
        }
    });

    return Object.entries(monthlyCounts).map(([month, count]) => ({ month, count }));
};


export function AdminAnalytics() {
    const [users, setUsers] = useState<User[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usersUnsub = onSnapshot(collection(db, "users"), (snapshot) => {
            setUsers(snapshot.docs.map(doc => doc.data() as User));
        });
        const eventsUnsub = onSnapshot(collection(db, "events"), (snapshot) => {
            setEvents(snapshot.docs.map(doc => doc.data() as Event));
        });
        
        // Optimize query by limiting to last 1000 messages for analytics
        const messagesQuery = query(collection(db, "messages"), orderBy("timestamp", "desc"), limit(1000));
        const messagesUnsub = onSnapshot(messagesQuery, (snapshot) => {
            setMessages(snapshot.docs.map(doc => doc.data() as ChatMessage));
        });

        const timer = setTimeout(() => setLoading(false), 1000);

        return () => {
            usersUnsub();
            eventsUnsub();
            messagesUnsub();
            clearTimeout(timer);
        };
    }, []);

    const userChartData = aggregateDataByMonth(users, 'createdAt');
    const eventChartData = aggregateDataByMonth(events, 'date');
    const messageChartData = aggregateDataByMonth(messages, 'timestamp');
    
    const chartConfig = {
        count: {
            label: "Count",
            color: "hsl(var(--primary))",
        },
    };

    if (loading) {
         return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    const maxUserCount = Math.max(...userChartData.map(d => d.count), 10);
    const maxMessageCount = Math.max(...messageChartData.map(d => d.count), 10);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-1 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>New Users</CardTitle>
                    <CardDescription>Sign-ups over the last 5 months.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                        <RechartsPrimitive.BarChart data={userChartData}>
                           <RechartsPrimitive.XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                           <RechartsPrimitive.YAxis domain={[0, maxUserCount]} />
                           <ChartTooltip content={<ChartTooltipContent />} />
                           <ChartBar dataKey="count" fill="var(--color-count)" radius={4} />
                        </RechartsPrimitive.BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-1 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Events Created</CardTitle>
                    <CardDescription>Events scheduled over the last 5 months.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                        <RechartsPrimitive.BarChart data={eventChartData}>
                           <RechartsPrimitive.XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                           <RechartsPrimitive.YAxis domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} />
                           <ChartTooltip content={<ChartTooltipContent />} />
                           <ChartBar dataKey="count" fill="var(--color-count)" radius={4} />
                        </RechartsPrimitive.BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-1 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Forum Activity</CardTitle>
                    <CardDescription>Messages posted over the last 5 months.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                        <RechartsPrimitive.BarChart data={messageChartData}>
                           <RechartsPrimitive.XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                           <RechartsPrimitive.YAxis domain={[0, maxMessageCount]} />
                           <ChartTooltip content={<ChartTooltipContent />} />
                           <ChartBar dataKey="count" fill="var(--color-count)" radius={4} />
                        </RechartsPrimitive.BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
