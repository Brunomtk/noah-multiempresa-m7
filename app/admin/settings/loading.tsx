import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="mb-8">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    </div>
  )
}
