import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { CouncilMember } from "@/lib/types";

export function CouncilCard({ member }: { member: CouncilMember }) {
  return (
    <Card className="text-center transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      <CardHeader>
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src={member.imageUrl}
            alt={`Photo of ${member.name}`}
            fill
            className="rounded-full object-cover border-4 border-primary/50"
            data-ai-hint="person portrait"
          />
        </div>
        <CardTitle className="font-headline text-2xl">{member.name}</CardTitle>
        <CardDescription className="text-primary font-semibold">{member.role}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Leading the charge for open-source innovation on campus.
        </p>
      </CardContent>
    </Card>
  );
}
