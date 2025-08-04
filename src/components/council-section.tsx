"use client";

import { CouncilCard } from "@/components/council-card";
import type { CouncilMember } from "@/lib/types";

interface CouncilSectionProps {
  title?: string;
  members: CouncilMember[];
  isAdmin: boolean;
  onDelete: (memberId: string) => void;
}

export function CouncilSection({ title, members, isAdmin, onDelete }: CouncilSectionProps) {

  return (
    <section>
      {title && <h2 className="text-3xl font-headline font-bold mb-8 text-center">{title}</h2>}
      <div className="flex flex-wrap gap-8 justify-center">
        {members.map((member) => (
          <CouncilCard
            key={member.id}
            member={member}
            isAdmin={isAdmin}
            onDelete={() => onDelete(member.id!)}
          />
        ))}
      </div>
    </section>
  );
}
