import { Skeleton } from "@/components/ui/skeleton";

export const ConversationSkeleton = () => {
    return (
        <div className="flex flex-col h-full">
            {/* Header Skeleton */}
            <div className="p-4 border-b flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-6 w-40" />
            </div>

            {/* Messages Skeleton */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
                        <div className={`space-y-2 ${i % 2 === 0 ? 'items-start' : 'items-end'}`}>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Skeleton */}
            <div className="p-4 border-t">
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
}; 