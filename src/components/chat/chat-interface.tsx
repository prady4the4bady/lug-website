
"use client";

import { useState, useEffect } from 'react';
import type { ChatMessage } from '@/lib/types';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { Loader2 } from 'lucide-react';
import { logActivity } from '@/lib/activity-logger';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

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
          timestamp: data.timestamp, // Can be null initially
          clientTimestamp: data.clientTimestamp,
          mediaUrl: data.mediaUrl,
          mediaType: data.mediaType,
        });
      });
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!user) {
      router.push('/signin');
      return;
    }
    const messageDoc = await addDoc(collection(db, "messages"), {
      text,
      user: user.displayName || 'You',
      avatarUrl: user.photoURL || 'https://placehold.co/40x40.png',
      timestamp: serverTimestamp(),
      clientTimestamp: Timestamp.now(),
    });
    await logActivity(user.uid, "Posted Message", `Sent a message in the forum. Message ID: ${messageDoc.id}`);
  };
  
  const handleFileUpload = async (mediaDataUri: string, file: File) => {
    if (!user) {
      router.push('/signin');
      return;
    }
    setUploading(true);
    
    const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
    const storageRef = ref(storage, `chat-media/${Date.now()}_${file.name}`);
    
    try {
      const uploadResult = await uploadString(storageRef, mediaDataUri, 'data_url');
      const downloadURL = await getDownloadURL(uploadResult.ref);

      const messageDoc = await addDoc(collection(db, "messages"), {
        text: `Uploaded a ${mediaType}.`,
        user: user.displayName || 'You',
        avatarUrl: user.photoURL || 'https://placehold.co/40x40.png',
        timestamp: serverTimestamp(),
        clientTimestamp: Timestamp.now(),
        mediaUrl: downloadURL,
        mediaType: mediaType
      });
      
      await logActivity(user.uid, "Uploaded Media", `Uploaded a ${mediaType} to the forum. Message ID: ${messageDoc.id}`);

    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card className="flex flex-col h-[70vh] bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Forum Chat</CardTitle>
        <CardDescription>Real-time discussion with club members.</CardDescription>
      </CardHeader>
      <ChatMessages messages={messages} loading={loading} />
      {uploading && (
        <div className="flex items-center justify-center p-4 border-t">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Uploading...</span>
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} onFileSelect={handleFileUpload} disabled={uploading || loading} />
    </Card>
  );
}
