"use client";

import { useEffect, useState } from 'react';
import { suggestImageTags } from '@/ai/flows/suggest-image-tags';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';

interface ImageTaggerProps {
  imageDataUri: string;
  onUpload: (tags: string[]) => void;
}

export function ImageTagger({ imageDataUri, onUpload }: ImageTaggerProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageDataUri) return;
    setIsLoading(true);
    suggestImageTags({ photoDataUri: imageDataUri })
      .then(response => {
        setTags(response.tags);
        setSelectedTags(new Set(response.tags));
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [imageDataUri]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Preview & Tags</CardTitle>
        <CardDescription>AI-suggested tags. Select the ones you want to include.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-video mb-4">
          <Image src={imageDataUri} alt="Preview" fill className="rounded-lg object-contain" />
        </div>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-8 w-1/4" />
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="font-semibold">Suggested Tags:</h4>
            {tags.map(tag => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={tag}
                  checked={selectedTags.has(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                />
                <label htmlFor={tag} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  <Badge variant="outline">{tag}</Badge>
                </label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => onUpload(Array.from(selectedTags))} disabled={isLoading}>
          Upload Image
        </Button>
      </CardFooter>
    </Card>
  );
}
