
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '../ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { Eye, Loader2, RefreshCw } from 'lucide-react';
import { UserActivityDialog } from './user-activity-dialog';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from "firebase/functions";
import { useToast } from '@/hooks/use-toast';

type User = {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isCouncilMember: boolean;
}

export function UserManager() {
    const { user, isAdmin: currentAdminIsAdmin } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
            setUsers(usersData);
        });

        return () => unsubscribe();
    }, []);

    const toggleAdmin = async (userId: string, currentStatus: boolean) => {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { isAdmin: !currentStatus });
    };

    const handleViewActivity = (user: User) => {
        setSelectedUser(user);
        setIsActivityLogOpen(true);
    };

    const handleSyncUsers = async () => {
        setIsSyncing(true);
        const functions = getFunctions();
        const syncUsers = httpsCallable(functions, 'syncUsers');
        try {
            const result = await syncUsers();
            toast({
                title: "Sync Successful",
                description: (result.data as { message: string }).message,
            });
        } catch (error) {
             console.error("Error syncing users:", error);
            toast({
                variant: "destructive",
                title: "Sync Failed",
                description: "An error occurred while syncing users.",
            });
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <>
            <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>View users and manage their admin permissions.</CardDescription>
                    </div>
                     <Button onClick={handleSyncUsers} disabled={isSyncing}>
                        {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Sync Users
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Admin</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(u => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">{u.name}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {u.isAdmin && <Badge variant="default">Admin</Badge>}
                                            {u.isCouncilMember && <Badge variant="secondary">Council</Badge>}
                                            {!u.isAdmin && !u.isCouncilMember && <Badge variant="outline">Member</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={u.isAdmin}
                                            onCheckedChange={() => toggleAdmin(u.id, u.isAdmin)}
                                            aria-label="Toggle admin status"
                                            disabled={!currentAdminIsAdmin || u.email === 'lugbpdc@dubai.bits-pilani.ac.in'}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleViewActivity(u)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {selectedUser && (
                <UserActivityDialog 
                    user={selectedUser} 
                    isOpen={isActivityLogOpen} 
                    onOpenChange={setIsActivityLogOpen} 
                />
            )}
        </>
    )
}
