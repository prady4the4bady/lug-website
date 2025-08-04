
"use client";

import { useState } from 'react';
import type { ChatMessage } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

const mockMessages: ChatMessage[] = [
  { id: '1', text: 'Hey everyone! Welcome to the forum.', user: 'Admin', avatarUrl: 'https://placehold.co/40x40.png', timestamp: new Date(Date.now() - 60000 * 5) },
  { id: '2', text: 'Just pushed my new dotfiles to GitHub, check them out!', user: 'Alex Johnson', avatarUrl: 'https://placehold.co/40x40.png', timestamp: new Date(Date.now() - 60000 * 2) },
  { id: '3', text: 'Uploaded an image.', user: 'Maria Garcia', avatarUrl: 'https://placehold.co/40x40.png', timestamp: new Date(), imageUrl: 'https://placehold.co/300x200.png' },
];

export function ForumModeration() {
    const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
    
    const handleDelete = (messageId: string) => {
        setMessages(messages.filter(msg => msg.id !== messageId));
    }

    return (
        <Card className="mt-6">
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
                                     {message.imageUrl && (
                                        <Image src={message.imageUrl} alt="Uploaded content" width={150} height={100} className="mt-2 rounded-lg" data-ai-hint="user uploaded" />
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{formatDistanceToNow(message.timestamp, { addSuffix: true })}</TableCell>
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
