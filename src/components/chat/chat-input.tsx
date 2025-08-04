
"use client";
import { useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from 'lucide-react';
import { CardFooter } from '@/components/ui/card';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onImageSelect: (dataUri: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, onImageSelect, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(e.target?.result as string);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <CardFooter className="p-4 border-t">
      <div className="flex w-full items-center space-x-2">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" disabled={disabled} />
        <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach image</span>
        </Button>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 resize-none"
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          disabled={disabled}
        />
        <Button onClick={handleSend} disabled={disabled || !text.trim()}><Send className="h-5 w-5" /></Button>
      </div>
    </CardFooter>
  );
}
