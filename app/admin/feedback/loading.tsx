import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[#2a3349]">
        <div>
          <Skeleton className="h-8 w-48 bg-[#1a2234]" />
          <Skeleton className="h-4 w-64 mt-2 bg-[#1a2234]" />
        </div>
        <Skeleton className="h-10 w-32 bg-[#1a2234]" />
      </div>

      <div className="p-4 flex-1">
        <Skeleton className="h-10 w-96 mb-4 bg-[#1a2234]" />
        <div className="rounded-md border border-[#2a3349] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1a2234] border-b border-[#2a3349]">
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <Skeleton className="h-4 w-8 bg-[#2a3349]" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <Skeleton className="h-4 w-20 bg-[#2a3349]" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <Skeleton className="h-4 w-24 bg-[#2a3349]" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <Skeleton className="h-4 w-16 bg-[#2a3349]" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <Skeleton className="h-4 w-20 bg-[#2a3349]" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <Skeleton className="h-4 w-16 bg-[#2a3349]" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <Skeleton className="h-4 w-16 bg-[#2a3349]" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <Skeleton className="h-4 w-16 bg-[#2a3349]" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-[#2a3349] bg-[#0f172a]">
                    <td className="p-4 align-middle">
                      <Skeleton className="h-4 w-8 bg-[#1a2234]" />
                    </td>
                    <td className="p-4 align-middle">
                      <Skeleton className="h-4 w-32 bg-[#1a2234]" />
                    </td>
                    <td className="p-4 align-middle">
                      <Skeleton className="h-4 w-24 bg-[#1a2234]" />
                    </td>
                    <td className="p-4 align-middle">
                      <Skeleton className="h-4 w-20 bg-[#1a2234]" />
                    </td>
                    <td className="p-4 align-middle">
                      <Skeleton className="h-6 w-16 rounded-full bg-[#1a2234]" />
                    </td>
                    <td className="p-4 align-middle">
                      <Skeleton className="h-6 w-16 rounded-full bg-[#1a2234]" />
                    </td>
                    <td className="p-4 align-middle">
                      <Skeleton className="h-4 w-20 bg-[#1a2234]" />
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-md bg-[#1a2234]" />
                        <Skeleton className="h-8 w-8 rounded-md bg-[#1a2234]" />
                        <Skeleton className="h-8 w-8 rounded-md bg-[#1a2234]" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-4 border-t border-[#2a3349] bg-[#0f172a]">
            <Skeleton className="h-4 w-48 bg-[#1a2234]" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20 bg-[#1a2234]" />
              <Skeleton className="h-8 w-20 bg-[#1a2234]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
