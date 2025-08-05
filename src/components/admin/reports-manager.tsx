
"use client";

import { useState, useEffect } from 'react';
import type { Report } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


const statusOptions: Report['status'][] = ['New', 'In Progress', 'Resolved'];

export function ReportsManager() {
    const [reports, setReports] = useState<Report[]>([]);
    
    useEffect(() => {
        const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const reportsData: Report[] = [];
            querySnapshot.forEach((doc) => {
                reportsData.push({ id: doc.id, ...doc.data() } as Report);
            });
            setReports(reportsData);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (reportId: string) => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            await deleteDoc(doc(db, "reports", reportId));
        }
    }
    
    const handleStatusChange = async (reportId: string, status: Report['status']) => {
        const reportRef = doc(db, "reports", reportId);
        await updateDoc(reportRef, { status });
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Bug Reports</CardTitle>
                <CardDescription>Manage and track user-submitted bug reports and feature requests.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Summary</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map(report => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <span className="cursor-pointer hover:underline">{report.summary}</span>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>{report.summary}</DialogTitle>
                                          <DialogDescription>
                                            Reported by {report.userName} ({report.userEmail})
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="prose prose-sm dark:prose-invert">
                                            <p>{report.description}</p>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                </TableCell>
                                <TableCell><Badge variant="outline">{report.category}</Badge></TableCell>
                                <TableCell>{report.userName}</TableCell>
                                <TableCell className="text-muted-foreground">{formatDistanceToNow(report.createdAt.toDate(), { addSuffix: true })}</TableCell>
                                <TableCell>
                                    <Select value={report.status} onValueChange={(value) => handleStatusChange(report.id, value as Report['status'])}>
                                        <SelectTrigger className="w-36">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map(option => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(report.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
