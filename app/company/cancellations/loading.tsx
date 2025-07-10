import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CancellationsLoading() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[#2a3349]">
        <div>
          <Skeleton className="h-8 w-48 bg-[#1a2234]" />
          <Skeleton className="h-4 w-64 mt-2 bg-[#1a2234]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 bg-[#1a2234]" />
          <Skeleton className="h-9 w-36 bg-[#1a2234]" />
        </div>
      </div>

      <div className="p-4 flex-1 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <Skeleton className="h-10 w-80 bg-[#1a2234]" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-64 bg-[#1a2234]" />
            <Skeleton className="h-10 w-10 bg-[#1a2234]" />
          </div>
        </div>

        <Card className="bg-[#0f172a] border-[#2a3349] h-full flex flex-col">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-48 bg-[#1a2234]" />
            <Skeleton className="h-4 w-32 mt-1 bg-[#1a2234]" />
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <div className="p-4">
              <div className="space-y-4">
                <Skeleton className="h-12 w-full bg-[#1a2234]" />
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full bg-[#1a2234]" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
