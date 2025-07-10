import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden flex rounded-lg border bg-white dark:bg-gray-950 dark:border-gray-800">
        <div className="w-80 border-r dark:border-gray-800 flex flex-col">
          <div className="p-4 border-b dark:border-gray-800">
            <h2 className="text-lg font-semibold">Conversas</h2>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col p-6 items-center justify-center">
          <Skeleton className="h-[400px] w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
