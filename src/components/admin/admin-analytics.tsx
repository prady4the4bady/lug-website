
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, Timestamp } from 'firebase/firestore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDaysInMonth, subYears, addYears, getYear, getMonth, setYear, setMonth } from 'date-fns';
import type { User, Event, ChatMessage } from '@/lib/types';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, XAxis, YAxis, Bar, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);


const aggregateDataByDay = (
    items: { createdAt?: Timestamp; date?: Timestamp; timestamp?: Timestamp | null }[], 
    dateKey: 'createdAt' | 'date' | 'timestamp',
    currentDate: Date
) => {
    const dailyCounts: Record<string, number> = {};
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    });

    daysInMonth.forEach(day => {
        const dayStr = format(day, 'd');
        dailyCounts[dayStr] = 0;
    });

    items.forEach(item => {
        // @ts-ignore
        const itemTimestamp = item[dateKey];
        if (itemTimestamp) {
            const itemDate = itemTimestamp.toDate();
            if (itemDate.getFullYear() === currentDate.getFullYear() && itemDate.getMonth() === currentDate.getMonth()) {
                const dayStr = format(itemDate, 'd');
                if (dayStr in dailyCounts) {
                    dailyCounts[dayStr]++;
                }
            }
        }
    });
    
    return Object.entries(dailyCounts).map(([day, count]) => ({ day, count }));
};


export function AdminAnalytics() {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

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

    const userChartData = useMemo(() => aggregateDataByDay(allUsers, 'createdAt', currentDate), [allUsers, currentDate]);
    const eventChartData = useMemo(() => aggregateDataByDay(allEvents, 'date', currentDate), [allEvents, currentDate]);
    const messageChartData = useMemo(() => aggregateDataByDay(allMessages, 'timestamp', currentDate), [allMessages, currentDate]);
    
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

    const handleDateChange = (year: number, month: number) => {
        setCurrentDate(new Date(year, month));
    };

    return (
        <div className="mt-6 space-y-6">
            <Card className="bg-card/60 backdrop-blur-sm p-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <h3 className="text-lg font-medium">Viewing Analytics For:</h3>
                     <div className="flex items-center gap-2">
                        <Select 
                            value={String(getMonth(currentDate))}
                            onValueChange={(val) => handleDateChange(getYear(currentDate), Number(val))}
                        >
                            <SelectTrigger className="w-36">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MONTHS.map((month, index) => (
                                    <SelectItem key={month} value={String(index)}>{month}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={String(getYear(currentDate))}
                             onValueChange={(val) => handleDateChange(Number(val), getMonth(currentDate))}
                        >
                            <SelectTrigger className="w-28">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {YEARS.map(year => (
                                     <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>New Users</CardTitle>
                        <CardDescription>Daily sign-ups for {format(currentDate, 'MMMM yyyy')}.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={userChartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <YAxis domain={[0, maxUserCount]} allowDecimals={false} fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                    }}
                                />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-1 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Events Created</CardTitle>
                        <CardDescription>Daily events scheduled for {format(currentDate, 'MMMM yyyy')}.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={eventChartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <YAxis domain={[0, maxEventCount]} allowDecimals={false} fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                    }}
                                />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-1 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Forum Activity</CardTitle>
                        <CardDescription>Daily messages for {format(currentDate, 'MMMM yyyy')}.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={messageChartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <YAxis domain={[0, maxMessageCount]} allowDecimals={false} fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                    }}
                                />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    