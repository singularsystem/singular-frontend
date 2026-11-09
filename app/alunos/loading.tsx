"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AlunosLoading() {
  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="rounded-md border p-4 space-y-4">
        <Skeleton className="h-8 w-full" />
        <Separator />
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </main>
  );
}

function Separator() {
  return <div className="h-px bg-gray-100 w-full" />;
}
