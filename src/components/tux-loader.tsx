
"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const TuxLoader = dynamic(
  () => import('./tux-model').then(mod => mod.TuxModel),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full max-w-md h-96 mx-auto lg:mx-0" />,
  }
);
