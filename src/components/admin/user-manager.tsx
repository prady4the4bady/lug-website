
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '../ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { Eye } from 'lucide-react';
import { UserActivityDialog } from './user-activity-dialog';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, query, where } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { Input } from '../ui/input';
import { UserActions } from './user-actions';
import { Button } from '../ui/button';

export function UserManager() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const q = query(collection(db, "users"), where("isCouncilMember", "==", false));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
            setUsers(usersData);
        });

        return () => unsubscribe();
    }, []);

    const filteredUsers = useMemo(() => {
        if (!searchQuery) {
            return users;
        }
        return users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const handleViewActivity = (user: User) => {
        setSelectedUser(user);
        setIsActivityLogOpen(true);
    };

    return (
        <>
            <Card className="mt-6 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>View users, manage permissions, and revoke subscriptions.</CardDescription>
                        </div>
                        <div className="w-full max-w-sm">
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Subscription</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map(u => (
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
                                        <Badge 
                                            variant={
                                                u.subscriptionStatus === 'active' ? 'default' 
                                                : u.subscriptionStatus === 'pending' ? 'secondary' 
                                                : 'outline'
                                            }
                                        >
                                            {u.subscriptionStatus || 'none'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleViewActivity(u)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                         <UserActions user={u} currentUserId={currentUser?.uid} />
                                    </TableCell>
                                </TableRow>
                            ))}
                             {filteredUsers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
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
