import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CompanyPaymentsLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[150px] bg-[#1a2234]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[100px] bg-[#1a2234]" />
          <Skeleton className="h-9 w-[120px] bg-[#1a2234]" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-[#1a2234] border-[#2a3349]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-[100px] bg-[#2a3349]" />
              <Skeleton className="h-4 w-4 rounded-full bg-[#2a3349]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-2 bg-[#2a3349]" />
              <Skeleton className="h-4 w-[150px] bg-[#2a3349]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Skeleton className="h-10 w-[300px] bg-[#1a2234]" />
          <div className="flex w-full sm:w-auto gap-2">
            <Skeleton className="h-9 w-full sm:w-[280px] bg-[#1a2234]" />
            <Skeleton className="h-9 w-9 bg-[#1a2234]" />
            <Skeleton className="h-9 w-9 bg-[#1a2234]" />
          </div>
        </div>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-[100px] bg-[#2a3349]" />
                  ))}
                </div>
                <Skeleton className="h-6 w-[80px] bg-[#2a3349]" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex gap-4">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <Skeleton key={j} className="h-6 w-[100px] bg-[#2a3349]" />
                    ))}
                  </div>
                  <Skeleton className="h-8 w-8 bg-[#2a3349]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-2">
          <Skeleton className="h-5 w-[150px] bg-[#1a2234]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-[80px] bg-[#1a2234]" />
            <Skeleton className="h-8 w-[80px] bg-[#1a2234]" />
          </div>
        </div>
      </div>
    </div>
  )
}
