"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, Calendar, Users, UserCheck, MapPin, ChevronLeft, ChevronRight, Bell, XCircle, CreditCard, Package, User, CheckSquare, MessageSquare } from 'lucide-react'
import { NoahLogo } from "@/components/noah-logo"
import { useCompanySidebar } from "./company-sidebar-context"
import { useAuth } from "@/contexts/auth-context"

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
    title: "Check Management",
    href: "/company/check-management",
    icon: CheckSquare,
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
  const { user } = useAuth()

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

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
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
            <AvatarFallback className="bg-[#06b6d4] text-white text-xs font-semibold">
              {user?.name ? getUserInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || "user@company.com"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
