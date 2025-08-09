
"use client";

import { useState, useEffect } from 'react';
import type { ChatMessage } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, Timestamp } from "firebase/firestore";

export function ForumModeration() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    
    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs: ChatMessage[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                msgs.push({
                    id: doc.id,
                    text: data.text,
                    user: data.user,
                    avatarUrl: data.avatarUrl,
                    timestamp: (data.timestamp as Timestamp | null),
                    mediaUrl: data.mediaUrl,
                    mediaType: data.mediaType
                });
            });
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (messageId: string) => {
        await deleteDoc(doc(db, "messages", messageId));
    }

    return (
        <Card className="mt-6 bg-card/60 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Forum Moderation</CardTitle>
                <CardDescription>Review and delete messages from the forum.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Posted</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.map(message => (
                            <TableRow key={message.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={message.avatarUrl} alt={message.user} />
                                            <AvatarFallback>{message.user.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{message.user}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p>{message.text}</p>
                                     {message.mediaType === 'image' && message.mediaUrl && (
                                        <Image src={message.mediaUrl} alt="Uploaded content" width={150} height={100} className="mt-2 rounded-lg" data-ai-hint="user uploaded" />
                                    )}
                                    {message.mediaType === 'video' && message.mediaUrl && (
                                        <video src={message.mediaUrl} controls width="250" className="mt-2 rounded-lg" data-ai-hint="user uploaded video" />
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {message.timestamp ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true }) : 'sending...'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(message.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
