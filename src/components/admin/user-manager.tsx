
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '../ui/badge';

type User = {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

const mockUsers: User[] = [
  { id: "1", name: "Alex Johnson", email: "alex@dubai.bits-pilani.ac.in", isAdmin: true },
  { id: "2", name: "Maria Garcia", email: "maria@dubai.bits-pilani.ac.in", isAdmin: false },
  { id: "3", name: "Chen Wei", email: "chen@dubai.bits-pilani.ac.in", isAdmin: false },
];

export function UserManager() {
    const [users, setUsers] = useState<User[]>(mockUsers);

    const toggleAdmin = (userId: string) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
        ));
    };

    return (
         <Card className="mt-6">
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View users and manage their permissions.</CardDescription>
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
