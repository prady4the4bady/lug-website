
"use client";

import { CouncilSection } from "@/components/council-section";
import { useAuth } from "@/hooks/use-auth";
import type { CouncilMember } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function CouncilPage() {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), where("isCouncilMember", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const membersData = snapshot.docs.map(doc => {
        const data = doc.data() as Omit<CouncilMember, 'id'>;
        return {
            id: doc.id,
            ...data,
        } as CouncilMember
      });
      setMembers(membersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const handleRemoveMember = async (userId: string) => {
    if (!userId) return;
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
        isCouncilMember: false,
        councilRole: null,
        councilDepartment: null,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const groupedMembers = members.reduce((acc, member) => {
    const { councilDepartment } = member;
    if (councilDepartment) {
        if (!acc[councilDepartment]) {
          acc[councilDepartment] = [];
        }
        acc[councilDepartment].push(member);
    }
    return acc;
  }, {} as Record<string, CouncilMember[]>);

  const departmentOrder = ["Core", "Technical", "DevOps", "Operations", "Creative", "Marketing", "Community", "Faculty In-Charge"];

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
              onDelete={handleRemoveMember}
            />
          )
        ))}
        {members.length === 0 && !loading && (
          <p className="text-center text-muted-foreground">The council for this year has not been announced yet.</p>
        )}
      </div>
    </div>
  );
}
