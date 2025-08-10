"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  BarChart3,
  CreditCard,
  MapPin,
  Star,
  AlertCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  Clock,
  UserCheck,
  FileText,
  Shield,
  UserPlus,
  Briefcase,
  Package,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/company/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Agendamentos",
    href: "/company/schedule",
    icon: Calendar,
  },
  {
    name: "Profissionais",
    href: "/company/professionals",
    icon: UserCheck,
  },
  {
    name: "Equipes",
    href: "/company/teams",
    icon: Briefcase,
  },
  {
    name: "Clientes",
    href: "/company/clients",
    icon: UserPlus,
  },
  {
    name: "Check-in",
    href: "/company/check-in",
    icon: Clock,
  },
  {
    name: "Check-out",
    href: "/company/check-out",
    icon: Clock,
  },
  {
    name: "Gestão de Checks",
    href: "/company/check-management",
    icon: FileText,
  },
  {
    name: "Recorrências",
    href: "/company/recurrence",
    icon: FileText,
  },
  {
    name: "GPS Tracking",
    href: "/company/gps-tracking",
    icon: MapPin,
  },
  {
    name: "Chat",
    href: "/company/chat",
    icon: MessageSquare,
  },
  {
    name: "Avaliações",
    href: "/company/reviews",
    icon: Star,
  },
  {
    name: "Feedback",
    href: "/company/feedback",
    icon: MessageSquare,
  },
  {
    name: "Reagendamentos",
    href: "/company/reschedule",
    icon: Calendar,
  },
  {
    name: "Cancelamentos",
    href: "/company/cancellations",
    icon: AlertCircle,
  },
  {
    name: "Notificações",
    href: "/company/notifications",
    icon: Bell,
  },
  {
    name: "Relatórios",
    href: "/company/reports",
    icon: BarChart3,
  },
  {
    name: "Materiais",
    href: "/company/materials",
    icon: Package,
  },
  {
    name: "Pagamentos",
    href: "/company/payments",
    icon: CreditCard,
  },
  {
    name: "Plano",
    href: "/company/plan",
    icon: Shield,
  },
  {
    name: "Perfil",
    href: "/company/profile",
    icon: Building2,
  },
]

interface CompanySidebarProps {
  className?: string
}

export function CompanySidebar({ className }: CompanySidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    const tokenKey = process.env.NEXT_PUBLIC_TOKEN_KEY || "maids_flow_token"
    const userKey = process.env.NEXT_PUBLIC_USER_KEY || "maids_flow_user"

    localStorage.removeItem(tokenKey)
    localStorage.removeItem(userKey)
    window.location.href = "/login"
  }

  // Mock data for notifications
  const notificationCount = 3

  return (
    <div className={cn("flex h-full flex-col bg-white border-r", className)}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold">Maids Flow</h1>
              <p className="text-xs text-muted-foreground">Empresa</p>
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const showBadge = item.name === "Notificações" && notificationCount > 0

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed ? "px-2" : "px-3",
                    isActive && "bg-green-50 text-green-700 hover:bg-green-100",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-3")} />
                  {!collapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span>{item.name}</span>
                      {showBadge && (
                        <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 text-xs">
                          {notificationCount}
                        </Badge>
                      )}
                    </div>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
            collapsed ? "px-2" : "px-3",
          )}
        >
          <LogOut className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-3")} />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  )
}
