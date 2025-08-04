import { CouncilCard } from "@/components/council-card";
import type { CouncilMember } from "@/lib/types";

interface CouncilSectionProps {
  title: string;
  members: CouncilMember[];
}

export function CouncilSection({ title, members }: CouncilSectionProps) {
  return (
    <section>
      <h2 className="text-3xl font-headline font-bold mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
        {members.map((member) => (
          <CouncilCard key={member.name} member={member} />
        ))}
      </div>
    </section>
  );
}
