
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '../ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { Eye } from 'lucide-react';
import { UserActivityDialog } from './user-activity-dialog';

type User = {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isBanned: boolean;
}

export function UserManager() {
    const { user, isAdmin } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);

    useEffect(() => {
        // In a real app, this data would be fetched from a secure backend.
        // For now, we'll display the currently authenticated user and some mock data.
        const mockUsers: User[] = [
             { id: "2", name: "Maria Garcia", email: "maria@dubai.bits-pilani.ac.in", isAdmin: false, isBanned: false },
             { id: "3", name: "Chen Wei", email: "chen@dubai.bits-pilani.ac.in", isAdmin: false, isBanned: true },
        ]

        if (user) {
            setUsers([
                { id: user.uid, name: user.displayName || "N/A", email: user.email || "N/A", isAdmin: isAdmin, isBanned: false },
                ...mockUsers
            ]);
        }
    }, [user, isAdmin]);

    const toggleAdmin = (userId: string) => {
        // This is a simulation. In a real app, this would trigger a secure backend function.
        console.log(`Toggling admin for user ${userId}`);
        setUsers(users.map(u => 
            u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u
        ));
    };
    
    const toggleBan = (userId: string) => {
        // This is a simulation. In a real app, this would trigger a secure backend function.
        console.log(`Toggling ban for user ${userId}`);
         setUsers(users.map(u => 
            u.id === userId ? { ...u, isBanned: !u.isBanned } : u
        ));
    }

    const handleViewActivity = (user: User) => {
        setSelectedUser(user);
        setIsActivityLogOpen(true);
    };

    return (
        <>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View users and manage their permissions and status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
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
                                        <Badge variant={u.isAdmin ? "default" : "secondary"}>
                                            {u.isAdmin ? "Admin" : "Member"}
                                        </Badge>
                                    </TableCell>
                                     <TableCell>
                                         <Switch
                                            checked={!u.isBanned}
                                            onCheckedChange={() => toggleBan(u.id)}
                                            aria-label="Toggle ban status"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={u.isAdmin}
                                            onCheckedChange={() => toggleAdmin(u.id)}
                                            aria-label="Toggle admin status"
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
