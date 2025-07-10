import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[350px] mt-2" />
      </div>

      <Skeleton className="h-10 w-[300px]" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[200px] mt-1" />
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-9 w-[100px]" />
              <Skeleton className="h-9 w-[100px]" />
            </div>
            <div className="mt-6 w-full">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-[80px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-[80px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-[80px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[250px] mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-[100px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-[1px] w-full" />

              <div className="space-y-2">
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-[80px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Skeleton className="h-10 w-[100px]" />
                <Skeleton className="h-10 w-[150px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
