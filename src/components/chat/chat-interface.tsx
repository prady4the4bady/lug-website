"use client";

import { useState, useEffect } from 'react';
import type { ChatMessage } from '@/lib/types';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { ImageTagger } from '@/components/chat/image-tagger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          text: data.text,
          user: data.user,
          avatarUrl: data.avatarUrl,
          timestamp: (data.timestamp as Timestamp)?.toDate() || new Date(),
          imageUrl: data.imageUrl,
        });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!user) {
      router.push('/signin');
      return;
    }
    await addDoc(collection(db, "messages"), {
      text,
      user: user.displayName || 'You',
      avatarUrl: user.photoURL || 'https://placehold.co/40x40.png',
      timestamp: serverTimestamp(),
    });
  };
  
  const handleImageSelect = (dataUri: string) => {
    if (!user) {
      router.push('/signin');
      return;
    }
    setImageDataUri(dataUri);
  }
  
  const handleImageUpload = async (tags: string[]) => {
    if (!user || !imageDataUri) {
      router.push('/signin');
      return;
    }

    const storageRef = ref(storage, `chat-images/${Date.now()}`);
    const uploadResult = await uploadString(storageRef, imageDataUri, 'data_url');
    const downloadURL = await getDownloadURL(uploadResult.ref);

    await addDoc(collection(db, "messages"), {
      text: `Uploaded an image with tags: ${tags.join(', ')}`,
      user: user.displayName || 'You',
      avatarUrl: user.photoURL || 'https://placehold.co/40x40.png',
      timestamp: serverTimestamp(),
      imageUrl: downloadURL,
    });
    
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
