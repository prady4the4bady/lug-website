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
      <div className="flex flex-wrap gap-8 justify-center">
        {members.map((member) => (
          <div key={member.name} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex justify-center">
             <CouncilCard member={member} />
          </div>
        ))}
      </div>
    </section>
  );
}
