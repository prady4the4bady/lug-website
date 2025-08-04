"use client";

import { CouncilSection } from "@/components/council-section";
import { useAuth } from "@/hooks/use-auth";
import type { CouncilMember } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function CouncilPage() {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "council"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CouncilMember));
      setMembers(membersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteMember = async (memberId: string) => {
    if (!memberId) return;
    await deleteDoc(doc(db, "council", memberId));
  };
  
  if (loading) {
     return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const groupedMembers = members.reduce((acc, member) => {
    const { department } = member;
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(member);
    return acc;
  }, {} as Record<string, CouncilMember[]>);


  // Define the order of departments
  const departmentOrder = ["Core", "Technical", "Operations", "Creative", "Marketing", "Community", "Faculty In-Charge"];

  return (
    <div className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Our Council</h1>
        <p className="text-lg text-muted-foreground mt-2">The team leading the Linux User Group.</p>
      </div>
      
      <div className="space-y-16">
        {departmentOrder.map(department => (
          groupedMembers[department] && (
            <CouncilSection 
              key={department}
              title={department}
              members={groupedMembers[department]} 
              isAdmin={isAdmin} 
              onDelete={handleDeleteMember}
            />
          )
        ))}
      </div>
    </div>
  );
}
