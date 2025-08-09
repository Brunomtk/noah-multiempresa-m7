"use client"

import { DashboardProvider, useDashboardContext } from "@/contexts/dashboard-context"
import { DashboardOverview } from "@/components/admin/dashboard-overview"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, BarChart, RefreshCw, Building2, UserCheck, ClipboardCheck } from "lucide-react"
import { useRouter } from "next/navigation"

function DashboardContent() {
  const { refresh, isLoading } = useDashboardContext()
  const router = useRouter()

  const quickActions = [
    {
      icon: Calendar,
      label: "New Appointment",
      path: "/admin/appointments",
    },
    {
      icon: Building2,
      label: "New Company",
      path: "/admin/companies",
    },
    {
      icon: UserCheck,
      label: "New Customer",
      path: "/admin/customers",
    },
    {
      icon: BarChart,
      label: "Reports",
      path: "/admin/reports",
    },
    {
      icon: Users,
      label: "New Team",
      path: "/admin/teams",
    },
    {
      icon: ClipboardCheck,
      label: "Check-in",
      path: "/admin/check-in",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-gray-400">Welcome to Noah's administrative panel.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-[#2a3349] text-white hover:bg-[#2a3349] bg-transparent"
          onClick={refresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {/* Main Dashboard Overview */}
      <DashboardOverview />

      {/* Quick Actions */}
      <Card className="bg-[#1a2234] border-[#2a3349] text-white">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Quick Actions</h3>
            <p className="text-gray-400 text-sm">Quick access to main features</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="bg-[#0f172a] border-[#2a3349] hover:border-[#06b6d4] transition-colors cursor-pointer"
                onClick={() => router.push(action.path)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <action.icon className="h-6 w-6 text-[#06b6d4] mb-2" />
                  <span className="text-xs">{action.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  )
}
