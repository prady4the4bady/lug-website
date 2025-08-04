"use client";

import { CouncilCard } from "@/components/council-card";
import type { CouncilMember } from "@/lib/types";
import { useState } from "react";

interface CouncilSectionProps {
  title: string;
  members: CouncilMember[];
  isAdmin: boolean;
}

export function CouncilSection({ title, members: initialMembers, isAdmin }: CouncilSectionProps) {
  const [members, setMembers] = useState(initialMembers);

  const handleDeleteMember = (memberName: string) => {
    setMembers(members.filter(member => member.name !== memberName));
  };

  return (
    <section>
      <h2 className="text-3xl font-headline font-bold mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
        {members.map((member) => (
          <CouncilCard
            key={member.name}
            member={member}
            isAdmin={isAdmin}
            onDelete={handleDeleteMember}
          />
        ))}
      </div>
    </section>
  );
}