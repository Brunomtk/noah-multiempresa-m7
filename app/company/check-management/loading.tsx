import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogIn, LogOut } from "lucide-react"

export default function CheckManagementLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 bg-[#2a3349]" />
          <Skeleton className="h-4 w-64 mt-2 bg-[#2a3349]" />
        </div>
      </div>

      <Tabs defaultValue="check-in" className="space-y-6">
        <TabsList className="bg-[#1a2234] border-[#2a3349]">
          <TabsTrigger value="check-in" className="data-[state=active]:bg-[#2a3349]">
            <LogIn className="h-4 w-4 mr-2" />
            Check-in Management
          </TabsTrigger>
          <TabsTrigger value="check-out" className="data-[state=active]:bg-[#2a3349]">
            <LogOut className="h-4 w-4 mr-2" />
            Check-out Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="check-in" className="space-y-6">
          <div className="flex justify-end">
            <Skeleton className="h-10 w-[300px] bg-[#2a3349]" />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-[#1a2234] border-[#2a3349]">
                <CardHeader className="space-y-0 pb-2">
                  <Skeleton className="h-4 w-24 bg-[#2a3349]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 bg-[#2a3349]" />
                  <Skeleton className="h-3 w-20 mt-1 bg-[#2a3349]" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-[#1a2234] border-[#2a3349]">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-[#2a3349]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-[#2a3349]" />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="check-out" className="space-y-6">
          <div className="flex justify-end">
            <Skeleton className="h-10 w-[300px] bg-[#2a3349]" />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-[#1a2234] border-[#2a3349]">
                <CardHeader className="space-y-0 pb-2">
                  <Skeleton className="h-4 w-24 bg-[#2a3349]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 bg-[#2a3349]" />
                  <Skeleton className="h-3 w-20 mt-1 bg-[#2a3349]" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-[#1a2234] border-[#2a3349]">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-[#2a3349]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-[#2a3349]" />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
