import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <Skeleton className="h-10 w-[150px]" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="p-4">
              <div className="flex items-center justify-between py-4 border-b">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-5 w-[80px]" />
              </div>

              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b">
                  <div>
                    <Skeleton className="h-5 w-[120px] mb-1" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-5 w-[120px]" />
                  <div>
                    <Skeleton className="h-5 w-[180px] mb-1" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <Skeleton className="h-6 w-[80px] rounded-full" />
                  <Skeleton className="h-5 w-[150px]" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
