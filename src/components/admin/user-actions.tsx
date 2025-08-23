
"use client";

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { logActivity } from '@/lib/activity-logger';

interface UserActionsProps {
  user: User;
  currentUserId?: string;
}

export function UserActions({ user, currentUserId }: UserActionsProps) {
  const { toast } = useToast();
  const [isRevokeAlertOpen, setIsRevokeAlertOpen] = useState(false);

  const toggleAdmin = async (currentStatus: boolean) => {
    if (!user.id) return;
    const userDocRef = doc(db, "users", user.id);
    await updateDoc(userDocRef, { isAdmin: !currentStatus });
    await logActivity(currentUserId!, 'Admin Status Changed', `Set admin status for ${user.email} to ${!currentStatus}.`);
    toast({
      title: "Permissions Updated",
      description: `${user.name}'s admin status has been changed.`,
    });
  };

  const handleRevokeSubscription = async () => {
    if (!user.id) return;
    try {
      const userDocRef = doc(db, "users", user.id);
      await updateDoc(userDocRef, {
        subscriptionStatus: 'none',
        subscriptionTier: null,
      });

      // If user was a member, remove them from members collection
      const memberDocRef = doc(db, "members", user.id);
      await deleteDoc(memberDocRef).catch(() => {});

      await logActivity(currentUserId!, 'Subscription Revoked', `Revoked subscription for ${user.email}.`);

      toast({
        title: "Subscription Revoked",
        description: `${user.name}'s subscription has been successfully revoked.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke subscription.",
        variant: "destructive",
      });
    } finally {
        setIsRevokeAlertOpen(false);
    }
  };

  const isSuperAdmin = user.email === 'lugbpdc@dubai.bits-pilani.ac.in';
  const isSelf = user.id === currentUserId;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            disabled={isSuperAdmin || isSelf}
          >
            <div className="flex items-center justify-between w-full">
              <span>Admin Access</span>
              <Switch
                checked={user.isAdmin}
                onCheckedChange={() => toggleAdmin(user.isAdmin)}
                disabled={isSuperAdmin || isSelf}
                aria-label="Toggle admin status"
              />
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {user.subscriptionStatus === 'active' && (
            <DropdownMenuItem
              onSelect={() => setIsRevokeAlertOpen(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Revoke Subscription</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isRevokeAlertOpen} onOpenChange={setIsRevokeAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will revoke {user.name}'s membership. They will lose access to member-only features but can re-subscribe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevokeSubscription}>
              Confirm Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
