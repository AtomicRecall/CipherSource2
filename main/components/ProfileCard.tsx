"use client";
import { Card, Skeleton } from "@heroui/react";
import StatsSkeleton from "@/components/StatsSkeleton";
import MatchNavbarSkeleton from "@/components/matchNavbarSkeleton";
export default function CreateSkeleton() {
  return (
    <div>
      <Card className={`space-y-5 p-4`} radius="lg">
      <div className={`flex  gap-3`}>
        <div>
          <Skeleton className="flex rounded-medium w-35 h-35" />
        </div>

        <div>
          <Skeleton className="flex rounded-full h-5 mb-4" />
          <div className="w-full flex flex-row gap-2">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
          <Skeleton className="flex rounded-full h-5 mt-11" />
        </div>
      </div>
    </Card>
    <div className="flex mt-2">
      <div className="mr-1">
                <MatchNavbarSkeleton />

      </div>
       <StatsSkeleton/>
    </div>

    </div>
    
  );
}
