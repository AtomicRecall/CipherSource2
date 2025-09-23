"use client"
import {Card, Skeleton} from "@heroui/react";

export default function MatchNavbarSkeleton() {
  return (
    <Card className={`w-70 py-4 mt-1`} radius="lg">
      <div className={`flex w-10 h-146`}>
        <div>
          <div className="flex ml-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-33 h-3 ml-2 mt-4 rounded-sm" />
          </div>
          
          <Skeleton className="flex w-65 h-35 mt-4 ml-2 rounded-medium" />
          <Skeleton className="flex w-65 h-35 mt-4 ml-2 rounded-medium" />
          <Skeleton className="flex w-65 h-35 mt-4 ml-2 rounded-medium" />
          <Skeleton className="flex w-65 h-35 mt-4 ml-2 rounded-medium" />

        </div>

      </div>
    </Card>
  );
}
