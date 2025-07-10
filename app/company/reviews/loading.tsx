import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col space-y-6 p-6 md:p-8">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <Skeleton className="h-10 w-full md:w-1/2 lg:w-1/3" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="mt-1 h-4 w-36" />

              <div className="mt-4 space-y-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="mt-1 h-3 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="mt-3 h-16 w-full" />
                      <div className="mt-3 flex items-center space-x-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
