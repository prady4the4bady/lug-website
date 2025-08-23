
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function JoinUsPage() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-1/4 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/10 blur-[100px]"></div>
      </div>
      <div className="container py-20 md:py-32 flex items-center justify-center">
        <Card className="w-full max-w-3xl text-center bg-card/80 backdrop-blur-sm animate-fadeInUp">
          <CardHeader>
            <CardTitle className="text-4xl font-headline">Join Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className="text-muted-foreground text-lg leading-relaxed">
              At LUG, we believe in the power of open-source technology and the freedom to create, share, and innovate. Our community brings together students passionate about Linux, open-source software, and collaborative development. From beginners to experts, we explore system administration, scripting, and cutting-edge tools through workshops, install fests, and discussions. At LUG, curiosity drives learning, collaboration fuels growth, and innovation thrives.
            </p>
            <Button asChild size="lg">
              <Link href="https://lug12.netlify.app/" target="_blank">
                Join Our Community Platform <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
