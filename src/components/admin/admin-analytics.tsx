
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { getYear, getMonth } from 'date-fns';
import type { User, Event, ChatMessage } from '@/lib/types';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, XAxis, YAxis, Bar, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '../ui/button';

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const aggregateDataByMonth = (
    items: { createdAt?: Timestamp; date?: Timestamp; timestamp?: Timestamp | null }[], 
    dateKey: 'createdAt' | 'date' | 'timestamp',
    year: number
) => {
    const monthlyCounts = Array(12).fill(0);

    items.forEach(item => {
        // @ts-ignore
        const itemTimestamp = item[dateKey];
        if (itemTimestamp) {
            const itemDate = itemTimestamp.toDate();
            if (getYear(itemDate) === year) {
                const monthIndex = getMonth(itemDate);
                monthlyCounts[monthIndex]++;
            }
        }
    });
    
    return MONTHS.map((month, index) => ({ month, count: monthlyCounts[index] }));
};


export function AdminAnalytics() {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const usersUnsub = onSnapshot(collection(db, "users"), (snapshot) => {
            setAllUsers(snapshot.docs.map(doc => doc.data() as User));
        });
        const eventsUnsub = onSnapshot(collection(db, "events"), (snapshot) => {
            setAllEvents(snapshot.docs.map(doc => doc.data() as Event));
        });
        const messagesUnsub = onSnapshot(collection(db, "messages"), (snapshot) => {
            setAllMessages(snapshot.docs.map(doc => doc.data() as ChatMessage));
        });

        const timer = setTimeout(() => setLoading(false), 1000);

        return () => {
            usersUnsub();
            eventsUnsub();
            messagesUnsub();
            clearTimeout(timer);
        };
    }, []);

    const userChartData = useMemo(() => aggregateDataByMonth(allUsers, 'createdAt', currentYear), [allUsers, currentYear]);
    const eventChartData = useMemo(() => aggregateDataByMonth(allEvents, 'date', currentYear), [allEvents, currentYear]);
    const messageChartData = useMemo(() => aggregateDataByMonth(allMessages, 'timestamp', currentYear), [allMessages, currentYear]);
    
    if (loading) {
         return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    const maxUserCount = Math.max(...userChartData.map(d => d.count), 5);
    const maxEventCount = Math.max(...eventChartData.map(d => d.count), 5);
    const maxMessageCount = Math.max(...messageChartData.map(d => d.count), 10);

    const handleYearChange = (direction: 'prev' | 'next') => {
        setCurrentYear(prevYear => direction === 'prev' ? prevYear - 1 : prevYear + 1);
    };

    return (
        <div className="mt-6 space-y-6">
            <Card className="bg-card/60 backdrop-blur-sm p-4">
                <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => handleYearChange('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="text-xl font-bold w-24 text-center">{currentYear}</h3>
                    <Button variant="outline" size="icon" onClick={() => handleYearChange('next')} disabled={currentYear === new Date().getFullYear()}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>New Users</CardTitle>
                        <CardDescription>Monthly sign-ups for {currentYear}.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 overflow-x-auto">
                        <div className="min-w-[600px] h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={userChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} interval={0} />
                                    <YAxis domain={[0, maxUserCount]} allowDecimals={false} fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))',
                                        }}
                                    />
                                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-1 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Events Created</CardTitle>
                        <CardDescription>Monthly events scheduled for {currentYear}.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 overflow-x-auto">
                        <div className="min-w-[600px] h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={eventChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} interval={0} />
                                    <YAxis domain={[0, maxEventCount]} allowDecimals={false} fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))',
                                        }}
                                    />
                                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-1 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Forum Activity</CardTitle>
                        <CardDescription>Monthly messages for {currentYear}.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 overflow-x-auto">
                        <div className="min-w-[600px] h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={messageChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} interval={0} />
                                    <YAxis domain={[0, maxMessageCount]} allowDecimals={false} fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))',
                                        }}
                                    />
                                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
