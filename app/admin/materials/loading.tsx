import { Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MaterialsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 bg-[#2a3349]" />
        <Skeleton className="h-10 w-32 bg-[#2a3349]" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <TabsList className="mb-0">
            <TabsTrigger value="all">All Materials</TabsTrigger>
            <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-full sm:w-[300px] bg-[#2a3349]" />
            <Skeleton className="h-10 w-[160px] bg-[#2a3349]" />
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <MaterialCardSkeleton key={i} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MaterialCardSkeleton() {
  return (
    <div className="bg-[#1a2234] border border-[#2a3349] rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-[#2a3349] flex items-center justify-center">
              <Package className="h-5 w-5 text-[#06b6d4]" />
            </div>
            <div>
              <Skeleton className="h-5 w-32 bg-[#2a3349]" />
              <Skeleton className="h-4 w-24 mt-1 bg-[#2a3349]" />
            </div>
          </div>
          <Skeleton className="h-8 w-16 bg-[#2a3349]" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-12 bg-[#2a3349]" />
            <Skeleton className="h-4 w-16 bg-[#2a3349]" />
          </div>
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-12 bg-[#2a3349]" />
            <Skeleton className="h-4 w-16 bg-[#2a3349]" />
          </div>
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-12 bg-[#2a3349]" />
            <Skeleton className="h-4 w-20 bg-[#2a3349]" />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#2a3349]">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24 bg-[#2a3349]" />
            <Skeleton className="h-4 w-20 bg-[#2a3349]" />
          </div>
        </div>
      </div>
    </div>
  )
}
