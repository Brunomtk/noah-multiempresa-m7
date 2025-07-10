"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Home,
  MessageSquare,
  Package,
  BarChart,
  Bell,
  History,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NoahLogo } from "@/components/noah-logo"
import { useMobile } from "@/hooks/use-mobile"

export function ProfessionalSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isMobile = useMobile()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/professional/dashboard",
      active: pathname === "/professional/dashboard",
    },
    {
      label: "Check",
      icon: CheckCircle,
      href: "/professional/check",
      active: pathname === "/professional/check",
    },
    {
      label: "Schedule",
      icon: Calendar,
      href: "/professional/schedule",
      active: pathname === "/professional/schedule",
    },
    {
      label: "Feedback",
      icon: ClipboardList,
      href: "/professional/feedback",
      active: pathname === "/professional/feedback",
    },
    {
      label: "Materials",
      icon: Package,
      href: "/professional/materials",
      active: pathname === "/professional/materials",
    },
    {
      label: "Performance",
      icon: BarChart,
      href: "/professional/performance",
      active: pathname === "/professional/performance",
    },
    {
      label: "Chat",
      icon: MessageSquare,
      href: "/professional/chat",
      active: pathname === "/professional/chat",
    },
    {
      label: "History",
      icon: History,
      href: "/professional/history",
      active: pathname === "/professional/history",
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "/professional/notifications",
      active: pathname === "/professional/notifications",
    },
    {
      label: "Profile",
      icon: User,
      href: "/professional/profile",
      active: pathname === "/professional/profile",
    },
  ]

  // Não renderizar o sidebar em dispositivos móveis
  if (isMobile) {
    return null
  }

  return (
    <div
      className={cn(
        "relative hidden md:flex h-screen flex-col border-r border-[#2a3349] bg-[#0f172a] transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed ? (
          <Link href="/professional/dashboard" className="flex items-center space-x-2">
            <NoahLogo className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Noah Pro</span>
          </Link>
        ) : (
          <Link href="/professional/dashboard" className="flex items-center justify-center w-full">
            <NoahLogo className="h-8 w-8" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-[-12px] top-8 h-6 w-6 rounded-full bg-[#0f172a] border border-[#2a3349] text-gray-400 hover:text-white hover:bg-[#1a2234] z-10"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                route.active ? "bg-[#06b6d4] text-white" : "text-gray-400 hover:bg-[#1a2234] hover:text-white",
                isCollapsed && "justify-center",
              )}
              title={isCollapsed ? route.label : undefined}
            >
              <route.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{route.label}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-[#2a3349] p-4">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-[#06b6d4] flex items-center justify-center text-white font-semibold">
            P
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Professional</p>
              <p className="text-xs text-gray-400 truncate">pro@company.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
