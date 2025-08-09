"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  Package,
  CreditCard,
  Users,
  DollarSign,
  RefreshCw,
  Building2,
  Phone,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { fetchApi } from "@/lib/api/utils"

interface User {
  id: number
  name: string
  email: string
  role: string
  status: number
  companyId: number
  professionalId?: number
  createdDate: string
  updatedDate: string
}

interface Company {
  id: number
  name: string
  cnpj: string
  responsible: string
  email: string
  phone: string
  planId: number
  status: number
  createdDate: string
  updatedDate: string
}

interface Appointment {
  id: number
  clientName: string
  address: string
  scheduledDate: string
  status: string
  professionalId?: number
  companyId: number
  notes?: string
  createdDate: string
  updatedDate: string
}

interface Payment {
  id: number
  amount: number
  dueDate: string
  paymentDate?: string
  status: string
  description: string
  method: string
  companyId: number
  createdDate: string
  updatedDate: string
}

interface Professional {
  id: number
  name: string
  email: string
  phone: string
  status: string
  companyId: number
  createdDate: string
  updatedDate: string
}

interface Plan {
  id: number
  name: string
  description: string
  price: number
  features: string[]
  maxUsers: number
  maxStorage: number
  isActive: boolean
  createdDate: string
  updatedDate: string
}

interface DashboardData {
  company: Company | null
  users: User[]
  appointments: Appointment[]
  payments: Payment[]
  professionals: Professional[]
  plan: Plan | null
}

export default function CompanyDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData>({
    company: null,
    users: [],
    appointments: [],
    payments: [],
    professionals: [],
    plan: null,
  })

  const { user, getCompanyId } = useAuth()

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const companyId = getCompanyId()
      if (!companyId) throw new Error("Company ID not found")

      // Fetch company data
      const companyData = await fetchApi<Company>(`/Companies/${companyId}`)

      // Fetch plan if available
      let planData: Plan | null = null
      if (companyData.planId) {
        try {
          planData = await fetchApi<Plan>(`/Plan/${companyData.planId}`)
        } catch {
          console.warn("Could not load plan data")
        }
      }

      // Fetch other data in parallel
      const [usersRes, appointmentsRes, paymentsRes, professionalsRes] = await Promise.allSettled([
        fetchApi<User[]>(`/Users?companyId=${companyId}`),
        fetchApi<Appointment[]>(`/Appointment?companyId=${companyId}`),
        fetchApi<Payment[]>(`/Payments?companyId=${companyId}`),
        fetchApi<Professional[]>(`/Professional?companyId=${companyId}`),
      ])

      const users = usersRes.status === "fulfilled" && Array.isArray(usersRes.value) ? usersRes.value : []
      const appointments =
        appointmentsRes.status === "fulfilled" && Array.isArray(appointmentsRes.value) ? appointmentsRes.value : []
      const payments = paymentsRes.status === "fulfilled" && Array.isArray(paymentsRes.value) ? paymentsRes.value : []
      const professionals =
        professionalsRes.status === "fulfilled" && Array.isArray(professionalsRes.value) ? professionalsRes.value : []

      setData({
        company: companyData,
        plan: planData,
        users,
        appointments,
        payments,
        professionals,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      console.error("Error loading dashboard:", err)
      setError(msg)
      toast({ title: "Error", description: msg, variant: "destructive" })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  // Derived statistics
  const stats = {
    totalUsers: data.users.length,
    activeUsers: data.users.filter((u) => u.status === 1).length,
    totalAppointments: data.appointments.length,
    confirmedAppointments: data.appointments.filter((a) => a.status === "confirmed").length,
    pendingAppointments: data.appointments.filter((a) => a.status === "pending").length,
    completedAppointments: data.appointments.filter((a) => a.status === "completed").length,
    cancelledAppointments: data.appointments.filter((a) => a.status === "cancelled").length,
    totalPayments: data.payments.length,
    paidPayments: data.payments.filter((p) => p.status === "paid").length,
    pendingPayments: data.payments.filter((p) => p.status === "pending").length,
    overduePayments: data.payments.filter((p) => p.status === "overdue").length,
    totalRevenue: data.payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0),
    pendingRevenue: data.payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
    totalProfessionals: data.professionals.length,
    activeProfessionals: data.professionals.filter((p) => p.status === "active").length,
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-64"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Overview of your company</p>
          {data.company && (
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <Building2 className="h-4 w-4" />
              {data.company.name}
              <Mail className="h-4 w-4" />
              {data.company.email}
              <Phone className="h-4 w-4" />
              {data.company.phone}
            </div>
          )}
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
          {refreshing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {/* Main Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{stats.activeUsers} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">{stats.completedAppointments} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              ${stats.pendingRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professionals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProfessionals}</div>
            <p className="text-xs text-muted-foreground">{stats.activeProfessionals} active</p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Information */}
      {data.plan && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Current Plan: {data.plan.name}
              </CardTitle>
              <Badge variant={data.plan.isActive ? "default" : "secondary"}>
                {data.plan.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{data.plan.description}</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-bold">
                    ${data.plan.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}/month
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Limits</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Users</span>
                    <span className="text-sm font-medium">
                      {stats.totalUsers}/{data.plan.maxUsers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage</span>
                    <span className="text-sm font-medium">{data.plan.maxStorage}GB</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Features</p>
                <div className="space-y-1">
                  {data.plan.features &&
                    data.plan.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span className="text-xs">{feature}</span>
                      </div>
                    ))}
                  {data.plan.features && data.plan.features.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{data.plan.features.length - 3} more features</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointment Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmedAppointments}</div>
            <p className="text-xs text-muted-foreground">Ready for execution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingAppointments}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completedAppointments}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelledAppointments}</div>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments Received</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paidPayments}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.pendingRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overduePayments}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      {data.appointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.appointments
              .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
              .slice(0, 5)
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        appointment.status === "confirmed"
                          ? "bg-green-500"
                          : appointment.status === "pending"
                            ? "bg-yellow-500"
                            : appointment.status === "completed"
                              ? "bg-blue-500"
                              : "bg-red-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{appointment.clientName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.scheduledDate).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-gray-500">{appointment.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        appointment.status === "confirmed"
                          ? "default"
                          : appointment.status === "pending"
                            ? "secondary"
                            : appointment.status === "completed"
                              ? "default"
                              : "destructive"
                      }
                    >
                      {appointment.status === "confirmed"
                        ? "Confirmed"
                        : appointment.status === "pending"
                          ? "Pending"
                          : appointment.status === "completed"
                            ? "Completed"
                            : "Cancelled"}
                    </Badge>
                  </div>
                </div>
              ))}
            {data.appointments.length > 5 && (
              <div className="text-center pt-2">
                <Button asChild variant="ghost">
                  <Link href="/company/schedule">
                    View All Appointments ({data.appointments.length})
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-auto p-4 flex-col gap-2">
              <Link href="/company/schedule">
                <Calendar className="h-6 w-6" />
                <span>View Schedule</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
              <Link href="/company/payments">
                <CreditCard className="h-6 w-6" />
                <span>Payments</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
              <Link href="/company/professionals">
                <Users className="h-6 w-6" />
                <span>Professionals</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
              <Link href="/company/profile">
                <Building2 className="h-6 w-6" />
                <span>Company Profile</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
