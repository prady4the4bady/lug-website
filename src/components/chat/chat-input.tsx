
"use client";
import { useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from 'lucide-react';
import { CardFooter } from '@/components/ui/card';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onFileSelect: (dataUri: string, file: File) => void;
  disabled?: boolean;
}

const compressImage = (file: File, maxWidth: number = 1080, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scaleRatio = maxWidth / img.width;
                const width = img.width > maxWidth ? maxWidth : img.width;
                const height = img.width > maxWidth ? img.height * scaleRatio : img.height;

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL(file.type, quality));
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};


export function ChatInput({ onSendMessage, onFileSelect, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        try {
            const compressedDataUri = await compressImage(file);
            onFileSelect(compressedDataUri, file);
        } catch (error) {
            
            // Fallback to original file if compression fails
            const reader = new FileReader();
            reader.onload = (e) => onFileSelect(e.target?.result as string, file);
            reader.readAsDataURL(file);
        }
      } else {
        // For non-image files like videos, don't compress
        const reader = new FileReader();
        reader.onload = (e) => onFileSelect(e.target?.result as string, file);
        reader.readAsDataURL(file);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <CardFooter className="p-4 border-t">
      <div className="flex w-full items-center space-x-2">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden" disabled={disabled} />
        <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach media</span>
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
