
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '../ui/badge';
import { useAuth } from '@/hooks/use-auth';

type User = {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

export function UserManager() {
    const { user, isAdmin } = useAuth();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        // In a real app, this data would be fetched from a secure backend.
        // For now, we'll display the currently authenticated user.
        if (user) {
            setUsers([{
                id: user.uid,
                name: user.displayName || "N/A",
                email: user.email || "N/A",
                isAdmin: isAdmin,
            }]);
        }
    }, [user, isAdmin]);

    const toggleAdmin = (userId: string) => {
        // This is a simulation. In a real app, this would trigger a secure backend function.
        console.log(`Toggling admin for user ${userId}`);
        setUsers(users.map(u => 
            u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u
        ));
    };

    return (
         <Card className="mt-6">
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View users and manage their permissions. (Currently showing logged-in user)</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Admin Access</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.isAdmin ? "default" : "secondary"}>
                                        {user.isAdmin ? "Admin" : "Member"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Switch
                                        checked={user.isAdmin}
                                        onCheckedChange={() => toggleAdmin(user.id)}
                                        aria-label="Toggle admin status"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
