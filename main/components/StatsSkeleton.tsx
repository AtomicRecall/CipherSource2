"use client";
import { Card, Skeleton } from "@heroui/react";
import { siteConfig } from "../config/site";

export default function StatsSkeleton() {
  return (
    <div>
    <Card className={`w-363 py-4 mt-1 ml-2`} radius="lg">
      <div className={`flex w-10 h-146`}>
        <div>
          <Skeleton className="flex w-65 mb-3 h-114 w-380 ml-2 rounded-medium" />
          <Skeleton className="flex w-65 mb-3 h-114 w-380 ml-2 rounded-medium" />
        </div>
      </div>
    </Card>
    <footer className="bottom-0 mt-auto flex flex-col items-center justify-center pointer-events-none h-0">
                    <span className="text-white ">&copy; {siteConfig.copyright}</span>
                    <p className="text-background font-bold text-shadow-lg">{siteConfig.version}</p>
              </footer>
    </div>
  );
}
