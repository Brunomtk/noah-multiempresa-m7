import { Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { PageLoading } from "@/components/ui/page-loading"

export default function Loading() {
  return <PageLoading />
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
