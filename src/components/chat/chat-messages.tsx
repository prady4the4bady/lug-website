
"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState, Fragment } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "../ui/separator";

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
            {isClient && message.timestamp ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true }) : '...'}
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

function DateSeparator({ date }: { date: Date }) {
    const formatDate = (date: Date) => {
        if (isToday(date)) return "Today";
        if (isYesterday(date)) return "Yesterday";
        return format(date, "MMMM d, yyyy");
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

export function ChatMessages({ messages }: { messages: ChatMessage[] }) {
    const renderMessagesWithSeparators = () => {
        let lastDate: string | null = null;
        return messages.map((message, index) => {
            if (!message.timestamp) return <ChatMessageItem key={message.id} message={message} />;

            const messageDate = message.timestamp.toDate().toDateString();
            const showSeparator = messageDate !== lastDate;
            lastDate = messageDate;

            return (
                <Fragment key={message.id}>
                    {showSeparator && (
                        <DateSeparator date={message.timestamp.toDate()} />
                    )}
                    <ChatMessageItem message={message} />
                </Fragment>
            );
        });
    };

    return (
        <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
                {renderMessagesWithSeparators()}
            </div>
        </ScrollArea>
    );
}
