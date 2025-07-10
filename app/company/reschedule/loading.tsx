export default function RescheduleLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 bg-[#1a2234] animate-pulse rounded" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-[#1a2234] animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-32 bg-[#1a2234] animate-pulse rounded-lg" />
      <div className="h-96 bg-[#1a2234] animate-pulse rounded-lg" />
    </div>
  )
}
