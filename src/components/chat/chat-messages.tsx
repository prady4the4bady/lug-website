import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ChatMessages({ messages }: { messages: ChatMessage[] }) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex items-start gap-3", message.user === 'You' && 'flex-row-reverse')}>
            <Avatar>
              <AvatarImage src={message.avatarUrl} alt={message.user} data-ai-hint="person avatar" />
              <AvatarFallback>{message.user.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className={cn("flex-1 max-w-[75%]", message.user === 'You' && 'text-right')}>
              <div className={cn("flex items-baseline gap-2", message.user === 'You' && 'justify-end')}>
                <p className="font-semibold">{message.user}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </p>
              </div>
              <div className={cn("p-3 rounded-lg mt-1", message.user === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                <p className="text-foreground/90">{message.text}</p>
                {message.imageUrl && (
                    <Image src={message.imageUrl} alt="Uploaded content" width={300} height={200} className="mt-2 rounded-lg" data-ai-hint="user uploaded" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
