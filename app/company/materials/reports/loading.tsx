import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-[250px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[80px]" />
          <Skeleton className="h-8 w-[80px]" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Card className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-[120px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-4 w-[150px] mt-1" />
          </CardContent>
        </Card>
        <Card className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-[120px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-4 w-[150px] mt-1" />
          </CardContent>
        </Card>
        <Card className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-[120px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-4 w-[150px] mt-1" />
          </CardContent>
        </Card>
        <Card className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-[120px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-4 w-[150px] mt-1" />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Skeleton className="h-10 w-[240px]" />
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <Skeleton className="h-10 w-[300px]" />

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
