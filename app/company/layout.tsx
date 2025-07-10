"use client"

import type React from "react"

import { CompanySidebar } from "@/components/company/company-sidebar"
import { CompanyHeader } from "@/components/company/company-header"
import { CompanySidebarProvider } from "@/components/company/company-sidebar-context"

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CompanySidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[#0f172a]">
        <CompanySidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <CompanyHeader />
          <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">{children}</main>
        </div>
      </div>
    </CompanySidebarProvider>
  )
}
