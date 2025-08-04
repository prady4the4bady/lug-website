"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

function ChatMessageItem({ message }: { message: ChatMessage }) {
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();
  const isYou = user?.displayName ? message.user === user.displayName : message.user === 'You';


  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={cn("flex items-start gap-3", isYou && 'flex-row-reverse')}>
      <Avatar>
        <AvatarImage src={message.avatarUrl} alt={message.user} data-ai-hint="person avatar" />
        <AvatarFallback>{message.user.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className={cn("flex-1 max-w-[75%]", isYou && 'text-right')}>
        <div className={cn("flex items-baseline gap-2", isYou && 'justify-end')}>
          <p className="font-semibold">{isYou ? 'You' : message.user}</p>
          <p className="text-xs text-muted-foreground">
            {isClient ? formatDistanceToNow(message.timestamp, { addSuffix: true }) : '...'}
          </p>
        </div>
        <div className={cn("p-3 rounded-lg mt-1", isYou ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
          <p className="text-foreground/90">{message.text}</p>
          {message.imageUrl && (
              <Image src={message.imageUrl} alt="Uploaded content" width={300} height={200} className="mt-2 rounded-lg" data-ai-hint="user uploaded" />
          )}
        </div>
      </div>
    </div>
  );
}


export function ChatMessages({ messages }: { messages: ChatMessage[] }) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-6">
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  );
}
