import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CancellationsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64 bg-[#2a3349]" />
        <Skeleton className="h-10 w-48 bg-[#2a3349]" />
      </div>

      {/* Dashboard Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-[#1a2234] border-[#2a3349]">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-32 bg-[#2a3349]" />
              <Skeleton className="h-4 w-24 bg-[#2a3349]" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-16 bg-[#2a3349]" />
                <Skeleton className="h-6 w-24 bg-[#2a3349]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64 bg-[#2a3349]" />
          <Skeleton className="h-10 w-48 bg-[#2a3349]" />
        </div>

        <div className="rounded-lg border border-[#2a3349] overflow-hidden">
          <div className="bg-[#1a2234] p-4">
            <div className="grid grid-cols-9 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-6 bg-[#2a3349]" />
              ))}
            </div>
          </div>
          <div className="bg-[#0f172a]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 border-b border-[#2a3349]">
                <div className="grid grid-cols-9 gap-4">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 bg-[#2a3349]" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 bg-[#2a3349]" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 bg-[#2a3349]" />
            <Skeleton className="h-8 w-20 bg-[#2a3349]" />
          </div>
        </div>
      </div>
    </div>
  )
}
