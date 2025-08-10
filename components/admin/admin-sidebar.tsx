"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  CreditCard,
  MapPin,
  Star,
  AlertCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Clock,
  FileText,
  UserPlus,
  Briefcase,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Empresas",
    href: "/admin/companies",
    icon: Building2,
  },
  {
    name: "Usuários",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Profissionais",
    href: "/admin/professionals",
    icon: UserCheck,
  },
  {
    name: "Clientes",
    href: "/admin/customers",
    icon: UserPlus,
  },
  {
    name: "Equipes",
    href: "/admin/teams",
    icon: Briefcase,
  },
  {
    name: "Agendamentos",
    href: "/admin/appointments",
    icon: Calendar,
  },
  {
    name: "Check-in",
    href: "/admin/check-in",
    icon: Clock,
  },
  {
    name: "Recorrências",
    href: "/admin/recurrences",
    icon: FileText,
  },
  {
    name: "GPS Tracking",
    href: "/admin/gps-tracking",
    icon: MapPin,
  },
  {
    name: "Avaliações",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    name: "Feedback",
    href: "/admin/feedback",
    icon: MessageSquare,
  },
  {
    name: "Cancelamentos",
    href: "/admin/cancellations",
    icon: AlertCircle,
  },
  {
    name: "Notificações",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    name: "Relatórios",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Planos",
    href: "/admin/plans",
    icon: Shield,
  },
  {
    name: "Pagamentos",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    name: "Configurações",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return (
    <div className={cn("flex h-full flex-col bg-white border-r", className)}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold">Maids Flow Admin</h1>
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
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed ? "px-2" : "px-3",
                    isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-3")} />
                  {!collapsed && <span>{item.name}</span>}
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
