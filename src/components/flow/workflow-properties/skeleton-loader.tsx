import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLoader() {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1 pb-4">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-2 w-1/3" />
            </div>


            <div className="flex flex-col gap-1">
                <Skeleton className="h-2 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </div>

            <div className="flex flex-col gap-2">
                <Skeleton className="h-2 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </div>

            <div className="flex flex-col gap-2">
                <Skeleton className="h-2 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </div>

            <div className="flex flex-col gap-2">
                <Skeleton className="h-2 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </div>

            <div className="flex flex-col gap-2">
                <Skeleton className="h-2 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </div>

            <div className="flex flex-col gap-2">
                <Skeleton className="h-2 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </div>

            <div className="flex flex-col gap-2">
                <Skeleton className="h-2 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </div>

            <div className="flex flex-col gap-2">
                <Skeleton className="h-2 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </div>

            <div className="flex flex-col gap-2">
                <Skeleton className="h-2 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </div>

        </div>
    );
}