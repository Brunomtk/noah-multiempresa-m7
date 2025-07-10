"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  MessageSquare,
  MapPin,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Bell,
  LogIn,
  LogOut,
  XCircle,
  Star,
  CreditCard,
  Package,
  BarChart,
  Package2,
  User,
} from "lucide-react"
import { NoahLogo } from "@/components/noah-logo"
import { useCompanySidebar } from "./company-sidebar-context"

const menuItems = [
  {
    title: "Dashboard",
    href: "/company/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Schedule",
    href: "/company/schedule",
    icon: Calendar,
  },
  {
    title: "Reschedule",
    href: "/company/reschedule",
    icon: RefreshCw,
  },
  {
    title: "Check-in",
    href: "/company/check-in",
    icon: LogIn,
  },
  {
    title: "Check-out",
    href: "/company/check-out",
    icon: LogOut,
  },
  {
    title: "Clients",
    href: "/company/clients",
    icon: Users,
  },
  {
    title: "Teams",
    href: "/company/teams",
    icon: Users,
  },
  {
    title: "Professionals",
    href: "/company/professionals",
    icon: UserCheck,
  },
  {
    title: "Payments",
    href: "/company/payments",
    icon: CreditCard,
  },
  {
    title: "Plan",
    href: "/company/plan",
    icon: Package,
  },
  {
    title: "Materials",
    href: "/company/materials",
    icon: Package2,
  },
  {
    title: "Reports",
    href: "/company/reports",
    icon: BarChart,
  },
  {
    title: "Cancellations",
    href: "/company/cancellations",
    icon: XCircle,
  },
  {
    title: "Feedback",
    href: "/company/feedback",
    icon: MessageSquare,
  },
  {
    title: "Chat",
    href: "/company/chat",
    icon: MessageSquare,
  },
  {
    title: "Reviews",
    href: "/company/reviews",
    icon: Star,
  },
  {
    title: "GPS Tracking",
    href: "/company/gps-tracking",
    icon: MapPin,
  },
  {
    title: "Profile",
    href: "/company/profile",
    icon: User,
  },
  {
    title: "Notifications",
    href: "/company/notifications",
    icon: Bell,
  },
]

export function CompanySidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useCompanySidebar()

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r border-[#2a3349] bg-[#0f172a] transition-all duration-300",
        collapsed ? "w-[70px]" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <Link href="/company/dashboard" className="flex items-center space-x-2">
            <NoahLogo className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Noah</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/company/dashboard" className="flex items-center justify-center w-full">
            <NoahLogo className="h-8 w-8" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute right-[-12px] top-8 h-6 w-6 rounded-full bg-[#0f172a] border border-[#2a3349] text-gray-400 hover:text-white hover:bg-[#1a2234] z-10"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-[#06b6d4] text-white" : "text-gray-400 hover:bg-[#1a2234] hover:text-white",
                  collapsed && "justify-center",
                )}
                title={collapsed ? item.title : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </div>
      </ScrollArea>

      <div className="border-t border-[#2a3349] p-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-[#06b6d4] flex items-center justify-center text-white font-semibold">
            C
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Company Admin</p>
              <p className="text-xs text-gray-400 truncate">admin@company.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
