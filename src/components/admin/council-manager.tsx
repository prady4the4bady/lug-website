
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CouncilMember, User } from '@/lib/types';
import { Trash2, Edit } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, query, where, updateDoc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const DEPARTMENTS = ["Core", "Technical", "DevOps", "Operations", "Creative", "Marketing", "Community", "Faculty In-Charge"];

export function CouncilManager() {
    const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);
    const [regularUsers, setRegularUsers] = useState<User[]>([]);
    const [editingMember, setEditingMember] = useState<CouncilMember | null>(null);

    const [selectedUserId, setSelectedUserId] = useState('');
    const [role, setRole] = useState('');
    const [department, setDepartment] = useState('');

    useEffect(() => {
        const councilQuery = query(collection(db, "users"), where("isCouncilMember", "==", true));
        const councilUnsub = onSnapshot(councilQuery, (snapshot) => {
            const membersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CouncilMember));
            setCouncilMembers(membersData);
        });

        const usersQuery = query(collection(db, "users"), where("isCouncilMember", "==", false));
        const usersUnsub = onSnapshot(usersQuery, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
            setRegularUsers(usersData);
        });

        return () => {
            councilUnsub();
            usersUnsub();
        };
    }, []);

    const handleEditClick = (member: CouncilMember) => {
        setEditingMember(member);
        setSelectedUserId(member.id!);
        setRole(member.councilRole || '');
        setDepartment(member.councilDepartment || '');
    };
    
    const clearForm = () => {
        setSelectedUserId('');
        setRole('');
        setDepartment('');
        setEditingMember(null);
    };

    const handleSubmit = async () => {
        if (!selectedUserId || !role || !department) {
            alert("Please fill in all required fields.");
            return;
        }

        const memberData = { 
            isCouncilMember: true,
            councilRole: role, 
            councilDepartment: department 
        };
        
        const userDocRef = doc(db, "users", selectedUserId);
        await updateDoc(userDocRef, memberData);
        
        clearForm();
    };

    const handleRemoveFromCouncil = async (userId: string) => {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
            isCouncilMember: false,
            councilRole: null,
            councilDepartment: null
        });
    };

    return (
        <div className="grid md:grid-cols-3 gap-8 mt-6">
            <div className="md:col-span-1">
                <Card className="bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>{editingMember ? 'Edit Council Member' : 'Add Council Member'}</CardTitle>
                        <CardDescription>{editingMember ? 'Update the role or department of a member.' : 'Assign a user to a council position.'}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="user">User</Label>
                             <Select onValueChange={setSelectedUserId} value={selectedUserId} disabled={!!editingMember}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                                <SelectContent>
                                   {editingMember ? (
                                        <SelectItem value={editingMember.id!}>{editingMember.name}</SelectItem>
                                   ) : (
                                       regularUsers.map(user => (
                                          <SelectItem key={user.id} value={user.id!}>{user.name}</SelectItem>
                                       ))
                                   )}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" placeholder="e.g., President" value={role} onChange={e => setRole(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select onValueChange={setDepartment} value={department}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DEPARTMENTS.map(dep => (
                                    <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button onClick={handleSubmit}>{editingMember ? 'Update Member' : 'Add Member'}</Button>
                        {editingMember && <Button variant="ghost" onClick={clearForm}>Cancel</Button>}
                    </CardFooter>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card className="bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Manage Council</CardTitle>
                        <CardDescription>Edit or remove existing council members.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {councilMembers.map(member => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={member.photoURL} alt={member.name} />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{member.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{member.councilRole}</TableCell>
                                        <TableCell>{member.councilDepartment}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEditClick(member)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCouncil(member.id!)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
