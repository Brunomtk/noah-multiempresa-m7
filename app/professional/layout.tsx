import type React from "react"
import { ProfessionalHeader } from "@/components/professional/professional-header"
import { ProfessionalSidebar } from "@/components/professional/professional-sidebar"

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      <ProfessionalSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <ProfessionalHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
