"use client";
import { Card, Skeleton } from "@heroui/react";

export default function RosterSkeleton() {
  return (
    <Card className="flex-row gap-3 items-center border rounded-lg bg-cumground mt-1 -ml-1 flex-shrink-0 min-w-max mr-2">
      {/* Season logo skeleton */}
      <Skeleton className="w-10 h-10 rounded-full ml-2 mb-11" />
      
      {/* Player avatars and names skeleton */}
      <div className="flex flex-row gap-2">
        {/* Main players (larger avatars) */}
        <div className="flex flex-col items-center mt-2 mr-4 mb-3">
          <Skeleton className="w-16 h-4 mb-2" /> {/* Player name */}
          <Skeleton className="w-12 h-12 rounded-full" /> {/* Avatar */}
        </div>
        <div className="flex flex-col items-center mt-2 mr-4 mb-3">
          <Skeleton className="w-16 h-4 mb-2" />
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        <div className="flex flex-col items-center mt-2 mr-4 mb-3">
          <Skeleton className="w-16 h-4 mb-2" />
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        <div className="flex flex-col items-center mt-2 mr-4 mb-3">
          <Skeleton className="w-16 h-4 mb-2" />
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        <div className="flex flex-col items-center mt-2 mr-4 mb-3">
          <Skeleton className="w-16 h-4 mb-2" />
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
      </div>
    </Card>
  );
}
