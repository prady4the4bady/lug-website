
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CouncilMember } from '@/lib/types';
import { Trash2, Edit } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const DEPARTMENTS = ["Core", "Technical", "Operations", "Creative", "Marketing", "Community", "Faculty In-Charge"];

export function CouncilManager() {
    const [members, setMembers] = useState<CouncilMember[]>([]);
    const [editingMember, setEditingMember] = useState<CouncilMember | null>(null);

    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [department, setDepartment] = useState('');

    useEffect(() => {
        const q = query(collection(db, "council"), orderBy("department"), orderBy("name"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const membersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CouncilMember));
            setMembers(membersData);
        });

        return () => unsubscribe();
    }, []);

    const handleEditClick = (member: CouncilMember) => {
        setEditingMember(member);
        setName(member.name);
        setRole(member.role);
        setImageUrl(member.imageUrl);
        setDepartment(member.department);
    };
    
    const clearForm = () => {
        setName('');
        setRole('');
        setImageUrl('');
        setDepartment('');
        setEditingMember(null);
    };

    const handleSubmit = async () => {
        if (!name || !role || !department || !imageUrl) {
            alert("Please fill in all required fields.");
            return;
        }

        const memberData = { name, role, department, imageUrl };

        if (editingMember) {
            const memberDocRef = doc(db, "council", editingMember.id!);
            await updateDoc(memberDocRef, memberData);
        } else {
            await addDoc(collection(db, "council"), memberData);
        }
        clearForm();
    };

    const handleDelete = async (memberId: string) => {
        await deleteDoc(doc(db, "council", memberId));
    };

    return (
        <div className="grid md:grid-cols-3 gap-8 mt-6">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>{editingMember ? 'Edit Member' : 'Add Member'}</CardTitle>
                        <CardDescription>{editingMember ? 'Update the details of the council member.' : 'Add a new member to the council.'}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="e.g., Alex Johnson" value={name} onChange={e => setName(e.target.value)} />
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
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input id="imageUrl" placeholder="https://placehold.co/200x200.png" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button onClick={handleSubmit}>{editingMember ? 'Update Member' : 'Add Member'}</Button>
                        {editingMember && <Button variant="ghost" onClick={clearForm}>Cancel</Button>}
                    </CardFooter>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Council</CardTitle>
                        <CardDescription>Edit or delete existing council members.</CardDescription>
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
                                {members.map(member => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={member.imageUrl} alt={member.name} />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{member.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{member.role}</TableCell>
                                        <TableCell>{member.department}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEditClick(member)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id!)}>
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
