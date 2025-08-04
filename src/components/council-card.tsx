import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CouncilMember } from "@/lib/types";

export function CouncilCard({ member }: { member: CouncilMember }) {
  return (
    <Card className="text-center transition-all duration-300 ease-in-out transform hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-2 group w-full max-w-xs relative">
      {member.vacant && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -left-2 rotate-[-20deg] text-sm px-3 py-1"
        >
          Vacant
        </Badge>
      )}
      <CardHeader>
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src={member.imageUrl}
            alt={`Photo of ${member.name}`}
            fill
            className="rounded-full object-cover border-4 border-primary/50 transition-all duration-300 group-hover:border-primary"
            data-ai-hint="person portrait"
          />
        </div>
        <CardTitle className="font-headline text-2xl">{member.name}</CardTitle>
        <CardDescription className="text-primary font-semibold">{member.role}</CardDescription>
      </CardHeader>
      <CardContent className="opacity-0 max-h-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:max-h-40">
        <p className="text-muted-foreground text-sm">
          Leading the charge for open-source innovation on campus.
        </p>
      </CardContent>
    </Card>
  );
}
