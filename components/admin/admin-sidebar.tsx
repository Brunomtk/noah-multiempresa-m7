"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  Building2,
  Calendar,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Home,
  MapPin,
  MessageSquare,
  Package,
  Package2,
  Settings,
  Star,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea as UIScrollArea } from "@/components/ui/scroll-area"
import { NoahLogo } from "@/components/noah-logo"

type SidebarContextType = {
  isOpen: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>{children}</SidebarContext.Provider>
}

export function AdminSidebar() {
  const { isOpen, toggleSidebar } = useSidebar()
  const pathname = usePathname()

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/companies", label: "Companies", icon: Building2 },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/professionals", label: "Professionals", icon: Users },
    { href: "/admin/teams", label: "Teams", icon: Users },
    { href: "/admin/appointments", label: "Appointments", icon: Calendar },
    { href: "/admin/recurrences", label: "Recurrences", icon: ClipboardList },
    { href: "/admin/check-in", label: "Check-in/Check-out", icon: CheckSquare },
    { href: "/admin/gps-tracking", label: "GPS Tracking", icon: MapPin },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/feedback", label: "Internal Feedback", icon: MessageSquare },
    { href: "/admin/cancellations", label: "Cancellations", icon: ClipboardList },
    { href: "/admin/payments", label: "Payments", icon: CreditCard },
    { href: "/admin/plans", label: "Plans", icon: Package },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/materials", label: "Materials", icon: Package2 },
    { href: "/admin/materials/reports", label: "Material Reports", icon: BarChart3 },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r border-[#2a3349] bg-[#0f172a] transition-all duration-300",
        isOpen ? "w-64" : "w-[70px]",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!isOpen ? (
          <Link href="/admin/dashboard" className="flex items-center justify-center w-full">
            <NoahLogo className="h-8 w-8" />
          </Link>
        ) : (
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <NoahLogo className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Noah Admin</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute right-[-12px] top-8 h-6 w-6 rounded-full bg-[#0f172a] border border-[#2a3349] text-gray-400 hover:text-white hover:bg-[#1a2234] z-10"
        >
          {isOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>
      </div>

      <UIScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-[#06b6d4] text-white" : "text-gray-400 hover:bg-[#1a2234] hover:text-white",
                  !isOpen && "justify-center",
                )}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </div>
      </UIScrollArea>

      <div className="border-t border-[#2a3349] p-4">
        <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-[#06b6d4] flex items-center justify-center text-white font-semibold">
            A
          </div>
          {isOpen && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-gray-400 truncate">admin@noah.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
