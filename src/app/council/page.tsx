import { CouncilCard } from "@/components/council-card";
import type { CouncilMember } from "@/lib/types";

const councilMembers: CouncilMember[] = [
  { role: "President", name: "Alex Johnson", imageUrl: "https://placehold.co/200x200.png" },
  { role: "Vice President", name: "Maria Garcia", imageUrl: "https://placehold.co/200x200.png" },
  { role: "Secretary", name: "Chen Wei", imageUrl: "https://placehold.co/200x200.png" },
  { role: "Treasurer", name: "Fatima Al-Fassi", imageUrl: "https://placehold.co/200x200.png" },
];

export default function CouncilPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Our Council</h1>
        <p className="text-lg text-muted-foreground mt-2">The team leading the Linux User Group.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {councilMembers.map((member) => (
          <CouncilCard key={member.name} member={member} />
        ))}
      </div>
    </div>
  );
}
