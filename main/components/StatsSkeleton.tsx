"use client";
import { Card, Skeleton } from "@heroui/react";

export default function StatsSkeleton() {
  return (
    <Card className={`w-386 py-4 mt-1 ml-2`} radius="lg">
      <div className={`flex w-10 h-146`}>
        <div>
          <Skeleton className="flex w-65 mb-3 h-114 w-380 ml-2 rounded-medium" />
          <Skeleton className="flex w-65 mb-3 h-114 w-380 ml-2 rounded-medium" />
        </div>
      </div>
    </Card>
  );
}
