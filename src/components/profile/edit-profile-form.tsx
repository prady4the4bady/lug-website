
"use client";

import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useToast } from '@/hooks/use-toast';
import { db, storage } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { logActivity } from '@/lib/activity-logger';

interface EditProfileFormProps {
  user: User | null;
}

const profileFormSchema = z.object({
  description: z.string().max(280, "Description must be 280 characters or less.").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function EditProfileForm({ user }: EditProfileFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      description: user?.description || '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      let photoURL = user.photoURL;
      let details = "Updated profile description.";

      if (newAvatar) {
        const storageRef = ref(storage, `avatars/${user.id}/${Date.now()}`);
        const uploadResult = await uploadString(storageRef, newAvatar, 'data_url');
        photoURL = await getDownloadURL(uploadResult.ref);
        details = "Updated profile picture and description."
      }
      
      const userDocRef = doc(db, "users", user.id);
      await updateDoc(userDocRef, {
        description: data.description,
        photoURL: photoURL
      });

      await logActivity(user.id, "Profile Updated", details);
      
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });

    } catch (error) {
      
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was a problem saving your profile.",
      });
    } finally {
      setIsLoading(false);
      setNewAvatar(null);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading user data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Council Profile</CardTitle>
        <CardDescription>Update your photo and add a description that will be visible on the council page.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={newAvatar || user.photoURL} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="picture">Profile Picture</Label>
                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Recommended: Square image, less than 2MB.</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself and your role in the LUG."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
