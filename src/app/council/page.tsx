"use client";

import { CouncilSection } from "@/components/council-section";
import { useAuth } from "@/hooks/use-auth";
import type { CouncilMember } from "@/lib/types";

const president: CouncilMember[] = [
  { role: "President", name: "Alex Johnson", imageUrl: "https://placehold.co/200x200.png" },
];

const coreMembers: CouncilMember[] = [
  { role: "Vice President", name: "Maria Garcia", imageUrl: "https://placehold.co/200x200.png" },
  { role: "Secretary", name: "Chen Wei", imageUrl: "https://placehold.co/200x200.png" },
  { role: "Treasurer", name: "Harsh", imageUrl: "https://placehold.co/200x200.png" },
  { role: "Core Member", name: "Sam Lee", imageUrl: "https://placehold.co/200x200.png" },
  { role: "Core Member", name: "Priya Singh", imageUrl: "https://placehold.co/200x200.png" },
  { role: "Core Member", name: "David Miller", imageUrl: "https://placehold.co/200x200.png" },
];

const technicalMembers: CouncilMember[] = [
    { role: "Tech Lead", name: "Alice Williams", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Tech Member", name: "Bob Brown", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Tech Member", name: "Charlie Davis", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Tech Member", name: "Diana Evans", imageUrl: "https://placehold.co/200x200.png" },
]

const operationsMembers: CouncilMember[] = [
    { role: "Ops Lead", name: "Frank Green", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Ops Member", name: "Grace Hall", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Ops Member", name: "Henry Irving", imageUrl: "https://placehold.co/200x200.png" },
]

const creativeMembers: CouncilMember[] = [
    { role: "Creative Lead", name: "Jack King", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Creative Member", name: "Karen Lewis", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Creative Member", name: "Leo Martin", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Creative Member", name: "Mona Nelson", imageUrl: "https://placehold.co/200x200.png" },
]

const marketingMembers: CouncilMember[] = [
    { role: "Marketing Lead", name: "Nate Olsen", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Marketing Member", name: "Olivia Perry", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Marketing Member", name: "Paul Quinn", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Marketing Member", name: "Rose Scott", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Marketing Member", name: "Steve Taylor", imageUrl: "https://placehold.co/200x200.png" },
]

const communityMembers: CouncilMember[] = [
    { role: "Community Lead", name: "Tina Underwood", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Community Member", name: "Uma Vance", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Community Member", name: "Victor White", imageUrl: "https://placehold.co/200x200.png" },
    { role: "Community Member", name: "Wendy Young", imageUrl: "https://placehold.co/200x200.png" },
]

const facultyInCharge: CouncilMember[] = [
    { role: "Faculty In-Charge", name: "Dr. Ziegler", imageUrl: "https://placehold.co/200x200.png" },
]

export default function CouncilPage() {
  const { isAdmin } = useAuth();
  
  return (
    <div className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Our Council</h1>
        <p className="text-lg text-muted-foreground mt-2">The team leading the Linux User Group.</p>
      </div>
      
      <div className="space-y-16">
        <CouncilSection title="Core" members={president} isAdmin={isAdmin} />
        <CouncilSection members={coreMembers} isAdmin={isAdmin} />
        <CouncilSection title="Technical" members={technicalMembers} isAdmin={isAdmin} />
        <CouncilSection title="Operations" members={operationsMembers} isAdmin={isAdmin} />
        <CouncilSection title="Creative" members={creativeMembers} isAdmin={isAdmin} />
        <CouncilSection title="Marketing" members={marketingMembers} isAdmin={isAdmin} />
        <CouncilSection title="Community" members={communityMembers} isAdmin={isAdmin} />
        <CouncilSection title="Faculty In-Charge" members={facultyInCharge} isAdmin={isAdmin} />
      </div>
    </div>
  );
}
