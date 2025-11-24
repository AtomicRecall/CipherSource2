"use client";
import { Card, Skeleton } from "@heroui/react";
import { siteConfig } from "../config/site";

export default function StatsSkeleton() {
  return (
    <div className=" -mx-3 px-4">
      <div className="flex flex-col w-full font-play">
        <Card className={`py-4 w-392 mt-1`} radius="lg">
          <div className={`flex  h-146`}>
            <div>
              <Skeleton className="flex mb-3 h-114 w-full ml-2 w-385 rounded-medium" />
              <Skeleton className="flex mb-3 h-114 w-full ml-2 w-385 rounded-medium" />
            </div>
          </div>
        </Card>
        <footer className="bottom-0 mt-auto flex flex-col items-center justify-center pointer-events-none h-0">
          <span className="text-white ">&copy; {siteConfig.copyright}</span>
          <p className="text-background font-bold text-shadow-lg">{siteConfig.version}</p>
        </footer>
      </div>
    </div>
  );
}
