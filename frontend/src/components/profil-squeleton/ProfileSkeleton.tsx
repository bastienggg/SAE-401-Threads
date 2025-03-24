import React from 'react';
import { Skeleton } from '../ui/skeleton';

export default function ProfileSkeleton() {
  return (
    <main className="flex flex-col items-center justify-between h-screen w-full">
      <div className="w-full max-w-3xl">
        <div className="overflow-hidden">
          <div className="relative">
            <Skeleton className="h-32 md:h-48 w-full" />
            <div className="absolute -bottom-12 md:-bottom-16 left-4 md:left-8">
              <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white" />
            </div>
          </div>

          <div className="pt-16 md:pt-20 pb-2 md:pb-4">
            <div className="flex flex-col space-y-1">
              <Skeleton className="h-6 md:h-8 w-1/2" />
              <div className="flex items-center text-muted-foreground text-sm">
                <Skeleton className="h-4 w-4 rounded-full mr-1" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4 px-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center text-xs md:text-sm">
              <Skeleton className="h-4 w-4 rounded-full mr-1" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="flex items-center text-xs md:text-sm">
              <Skeleton className="h-4 w-4 rounded-full mr-1" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Skeleton className="h-12" />
      </div>
    </main>
  );
}