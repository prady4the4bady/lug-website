
"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const TuxModel = dynamic(() => import('./tux-model').then(mod => mod.TuxModel), {
  ssr: false,
  loading: () => <Skeleton className="w-full max-w-md h-96 mx-auto lg:mx-0" />,
});

export function TuxLoader() {
  return (
    <div className="relative w-full max-w-md h-96 mx-auto lg:mx-0 rounded-lg bg-card/80">
       <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <TuxModel />
       </Suspense>
    </div>
  );
}
