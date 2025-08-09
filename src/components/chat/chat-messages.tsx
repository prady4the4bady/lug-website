
"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState, Fragment, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "../ui/separator";
import { ChatBubble } from "./chat-bubble";
import { Skeleton } from "../ui/skeleton";

function ChatMessageItem({ message }: { message: ChatMessage }) {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!user) {
    return null;
  }

  const isYou = message.user === user.displayName || (user.displayName === null && message.user === 'You');

  const getTimestamp = () => {
    const ts = message.timestamp || message.clientTimestamp;
    return ts ? ts.toDate() : null;
  }

  const timestampDate = getTimestamp();

  return (
    <div className={cn("flex items-start gap-3", isYou && 'flex-row-reverse')}>
      <Avatar>
        <AvatarImage src={message.avatarUrl} alt={message.user} data-ai-hint="person avatar" />
        <AvatarFallback>{message.user.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className={cn("flex flex-col items-start gap-1 max-w-[75%]", isYou && 'items-end')}>
        <div className={cn("flex items-baseline gap-2", isYou && 'justify-end')}>
          <p className="font-semibold">{isYou ? 'You' : message.user}</p>
          <p className="text-xs text-muted-foreground">
            {isClient && timestampDate ? formatDistanceToNow(timestampDate, { addSuffix: true }) : '...'}
          </p>
        </div>
        <ChatBubble isYou={isYou}>
          <p className="whitespace-pre-wrap">{message.text}</p>
          {message.mediaUrl && message.mediaType === 'image' && (
              <Image src={message.mediaUrl} alt="Uploaded content" width={300} height={200} className="mt-2 rounded-lg" data-ai-hint="user uploaded" />
          )}
          {message.mediaUrl && message.mediaType === 'video' && (
             <video src={message.mediaUrl} controls className="mt-2 rounded-lg max-w-full" data-ai-hint="user uploaded video">
                Your browser does not support the video tag.
             </video>
          )}
        </ChatBubble>
      </div>
    </div>
  );
}

function DateSeparator({ date }: { date: Date | null }) {
    if (!date) return null;

    const formatDate = (d: Date) => {
        if (isToday(d)) return "Today";
        if (isYesterday(d)) return "Yesterday";
        return format(d, "MMMM d, yyyy");
    };

    return (
        <div className="relative my-4">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">
                    {formatDate(date)}
                </span>
            </div>
        </div>
    );
}

const LoadingSkeleton = () => (
    <div className="space-y-6 p-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className={cn("flex items-start gap-3", i % 2 !== 0 && "flex-row-reverse")}>
                 <Skeleton className="h-10 w-10 rounded-full" />
                 <div className={cn("flex flex-col gap-2", i % 2 !== 0 && "items-end")}>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                     <Skeleton className="h-12 w-48" />
                 </div>
            </div>
        ))}
    </div>
)


export function ChatMessages({ messages, loading }: { messages: ChatMessage[], loading: boolean }) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const renderMessagesWithSeparators = () => {
        let lastDate: string | null = null;
        return messages.map((message) => {
            const messageTimestamp = message.timestamp || message.clientTimestamp;
            if (!messageTimestamp) return <ChatMessageItem key={message.id} message={message} />;
            
            const messageDate = messageTimestamp.toDate().toDateString();
            const showSeparator = messageDate !== lastDate;
            lastDate = messageDate;

            return (
                <Fragment key={message.id}>
                    {showSeparator && (
                        <DateSeparator date={messageTimestamp.toDate()} />
                    )}
                    <ChatMessageItem message={message} />
                </Fragment>
            );
        });
    };

    return (
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
             {loading ? <LoadingSkeleton /> : (
                <div className="p-4 space-y-6">
                    {renderMessagesWithSeparators()}
                </div>
            )}
        </ScrollArea>
    );
}
