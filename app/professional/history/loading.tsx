import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[350px] mt-2" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Skeleton className="h-10 w-full sm:w-[300px]" />
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-[180px]" />
          <Skeleton className="h-10 w-full sm:w-[180px]" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-[300px]" />

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-[100px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-[80px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <Skeleton className="h-5 w-[150px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex flex-col items-start gap-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                    <Skeleton className="h-9 w-[100px]" />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-center mt-6">
              <Skeleton className="h-10 w-[150px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
