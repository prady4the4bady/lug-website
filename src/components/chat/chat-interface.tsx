"use client";

import { useState } from 'react';
import type { ChatMessage } from '@/lib/types';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { ImageTagger } from '@/components/chat/image-tagger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';

const initialMessages: ChatMessage[] = [
  { id: '1', text: 'Hey everyone! Welcome to the forum.', user: 'Admin', avatarUrl: 'https://placehold.co/40x40.png', timestamp: new Date(Date.now() - 60000 * 5) },
  { id: '2', text: 'Just pushed my new dotfiles to GitHub, check them out!', user: 'Alex Johnson', avatarUrl: 'https://placehold.co/40x40.png', timestamp: new Date(Date.now() - 60000 * 2) },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);

  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      user: 'You',
      avatarUrl: 'https://placehold.co/40x40.png',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  const handleImageSelect = (dataUri: string) => {
    setImageDataUri(dataUri);
  }
  
  const handleImageUpload = (tags: string[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Uploaded an image with tags: ${tags.join(', ')}`,
      user: 'You',
      avatarUrl: 'https://placehold.co/40x40.png',
      timestamp: new Date(),
      imageUrl: imageDataUri!,
    };
    setMessages(prev => [...prev, newMessage]);
    setImageDataUri(null);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 flex flex-col h-[70vh]">
        <CardHeader>
          <CardTitle>Forum Chat</CardTitle>
          <CardDescription>Real-time discussion with club members.</CardDescription>
        </CardHeader>
        <ChatMessages messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} onImageSelect={handleImageSelect} />
      </Card>
      <div className="lg:col-span-1">
        {imageDataUri ? (
            <ImageTagger imageDataUri={imageDataUri} onUpload={handleImageUpload} />
        ) : (
            <Card className="h-full flex items-center justify-center bg-muted/30 border-dashed">
                <CardContent className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Select an image to see AI-powered tag suggestions.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
