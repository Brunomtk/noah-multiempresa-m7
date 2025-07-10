import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PlanLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <Tabs defaultValue="current-plan" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current-plan">Current Plan</TabsTrigger>
          <TabsTrigger value="available-plans">Available Plans</TabsTrigger>
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="current-plan" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-64 mt-2" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                </div>

                <Skeleton className="h-px w-full" />

                <div className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <div className="space-y-3">
                    {Array(2)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <Skeleton className="h-2 w-full" />
                        </div>
                      ))}
                  </div>
                </div>

                <Skeleton className="h-px w-full" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex items-baseline">
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48 mt-1" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Skeleton className="h-4 w-4 mt-0.5" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-48 mt-1" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
