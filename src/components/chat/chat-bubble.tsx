
"use client";

import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  children: React.ReactNode;
  isYou: boolean;
}

export function ChatBubble({ children, isYou }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "relative p-3 rounded-lg",
        isYou
          ? "bg-primary text-primary-foreground rounded-br-none"
          : "bg-muted rounded-bl-none"
      )}
    >
      <div className={cn(
        "absolute bottom-0 w-3 h-3",
        isYou ? "right-[-6px]" : "left-[-6px]"
      )}>
        <div className={cn(
          "w-full h-full rounded-bl-full",
          isYou ? "bg-primary" : "bg-muted"
        )}></div>
      </div>
      {children}
    </div>
  );
}
