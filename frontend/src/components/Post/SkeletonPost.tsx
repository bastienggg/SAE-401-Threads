import React from 'react';
import { Skeleton } from "../ui/skeleton"

export default function SkeletonPost() {
    return (
        <div className="flex flex-row gap-4 p-4 w-full bg-white rounded-md shadow-md my-2 animate-pulse justify-between items-start">
            <Skeleton className="w-9 aspect-square rounded-full" />
            <div className="w-full flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2 justify-between w-full">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}