
"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { CouncilMember } from "@/lib/types";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface CouncilCardProps {
  member: CouncilMember;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export function CouncilCard({ member, isAdmin, onDelete }: CouncilCardProps) {
  return (
    <Card className="text-center transition-all duration-300 ease-in-out transform hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-2 group w-full max-w-xs relative flex flex-col">
      {isAdmin && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(member.id!)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove member</span>
        </Button>
      )}
      <CardHeader>
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src={member.photoURL || `https://placehold.co/128x128.png`}
            alt={`Photo of ${member.name}`}
            fill
            className="rounded-full object-cover border-4 border-primary/50 transition-all duration-300 group-hover:border-primary"
            data-ai-hint="person portrait"
          />
        </div>
        <CardTitle className="font-headline text-2xl">{member.name}</CardTitle>
        <CardDescription className="text-primary font-semibold">{member.councilRole}</CardDescription>
      </CardHeader>
      {member.description && (
        <CardContent className="flex-grow opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-300 ease-in-out overflow-hidden">
          <p className="text-muted-foreground text-sm pt-4">{member.description}</p>
        </CardContent>
      )}
    </Card>
  );
}
