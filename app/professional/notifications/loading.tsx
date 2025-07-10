import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[350px] mt-2" />
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-9 w-[180px]" />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[100px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-3 rounded-lg border">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <Skeleton className="h-5 w-[150px]" />
                  <Skeleton className="h-5 w-[80px]" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-8 w-[100px]" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[100px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-3 rounded-lg border">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <Skeleton className="h-5 w-[150px]" />
                  <Skeleton className="h-5 w-[80px]" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-8 w-[100px]" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-center mt-6">
        <Skeleton className="h-10 w-[200px]" />
      </div>
    </div>
  )
}
