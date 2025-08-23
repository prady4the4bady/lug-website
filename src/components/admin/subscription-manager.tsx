
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User, Member, SubscriptionTier } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, query, where, updateDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SubscriptionManager() {
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(db, "users"), where("subscriptionStatus", "==", "pending"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
            setPendingUsers(usersData);
        });

        return () => unsubscribe();
    }, []);

    const handleApproval = async (user: User) => {
        if (!user.id || !user.subscriptionTier) return;
        
        try {
            const userDocRef = doc(db, "users", user.id);
            const memberDocRef = doc(db, "members", user.id);
            
            const now = new Date();
            let expiryDate;
            
            // Create a new Date object for calculations to avoid mutating `now`
            if (user.subscriptionTier === 'Annual') {
                expiryDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
            } else { // Semester
                expiryDate = new Date(now.getFullYear(), now.getMonth() + 4, now.getDate());
            }
            
            const memberData: Member = {
                userId: user.id,
                name: user.name,
                email: user.email,
                tier: user.subscriptionTier,
                joinedAt: serverTimestamp() as Timestamp,
                memberUntil: Timestamp.fromDate(expiryDate)
            };
            
            await setDoc(memberDocRef, memberData);
            await updateDoc(userDocRef, { subscriptionStatus: 'active' });

            toast({
                title: 'Membership Approved',
                description: `${user.name} is now an active member.`,
            });
        } catch (error) {
            toast({
                title: 'Approval Failed',
                description: 'There was an error approving the membership.',
                variant: 'destructive',
            });
        }
    };

    const handleRejection = async (user: User) => {
        if (!user.id) return;
        
        try {
            const userDocRef = doc(db, "users", user.id);
            await updateDoc(userDocRef, { subscriptionStatus: 'none', subscriptionTier: null });
            
            toast({
                title: 'Subscription Rejected',
                description: `${user.name}'s pending subscription has been cancelled.`,
            });
        } catch (error) {
             toast({
                title: 'Rejection Failed',
                description: 'There was an error rejecting the subscription.',
                variant: 'destructive',
            });
        }
    };
    
    return (
        <Card className="mt-6 bg-card/60 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Subscription Approvals</CardTitle>
                <CardDescription>Approve or reject users who are pending payment for their subscription.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Tier</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingUsers.map(user => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.photoURL} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell><Badge variant="outline">{user.subscriptionTier}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="mr-2 text-green-500 hover:text-green-600" onClick={() => handleApproval(user)}>
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleRejection(user)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                         {pendingUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                    No pending subscriptions.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
