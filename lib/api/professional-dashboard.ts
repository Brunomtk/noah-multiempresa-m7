import type { Appointment, PerformanceMetrics, Notification, Review } from "@/types"
import { apiRequest } from "./utils"

export interface DashboardStats {
  todayAppointments: number
  weekAppointments: number
  monthAppointments: number
  completedToday: number
  pendingCheckIns: number
  averageRating: number
  totalReviews: number
  monthlyEarnings: number
  completionRate: number
  punctualityRate: number
}

export interface DashboardSummary {
  stats: DashboardStats
  upcomingAppointments: Appointment[]
  recentActivities: Activity[]
  performanceMetrics: PerformanceMetrics
  recentReviews: Review[]
  notifications: Notification[]
  weeklySchedule: WeeklySchedule[]
  monthlyTrend: MonthlyTrend
}

export interface Activity {
  id: string
  type: "check_in" | "check_out" | "appointment_completed" | "review_received" | "payment_received"
  title: string
  description: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface WeeklySchedule {
  date: string
  dayOfWeek: string
  appointments: number
  completed: number
  cancelled: number
}

export interface MonthlyTrend {
  appointments: TrendData[]
  earnings: TrendData[]
  ratings: TrendData[]
}

export interface TrendData {
  date: string
  value: number
  change?: number
}

// Get dashboard summary for professional
export async function getProfessionalDashboard(): Promise<DashboardSummary> {
  const response = await apiRequest<any>({
    url: "/professional/dashboard",
    method: "GET",
  })

  return {
    ...response,
    upcomingAppointments: response.upcomingAppointments.map((apt: any) => ({
      ...apt,
      scheduledDate: new Date(apt.scheduledDate),
      createdAt: new Date(apt.createdAt),
      updatedAt: new Date(apt.updatedAt),
    })),
    recentActivities: response.recentActivities.map((activity: any) => ({
      ...activity,
      timestamp: new Date(activity.timestamp),
    })),
    performanceMetrics: {
      ...response.performanceMetrics,
      startDate: new Date(response.performanceMetrics.startDate),
      endDate: new Date(response.performanceMetrics.endDate),
      createdAt: new Date(response.performanceMetrics.createdAt),
      updatedAt: new Date(response.performanceMetrics.updatedAt),
    },
    recentReviews: response.recentReviews.map((review: any) => ({
      ...review,
      createdAt: new Date(review.createdAt),
    })),
  }
}

// Get dashboard statistics
export async function getProfessionalDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>({
    url: "/professional/dashboard/stats",
    method: "GET",
  })
}

// Get upcoming appointments for dashboard
export async function getProfessionalUpcomingAppointments(limit = 5): Promise<Appointment[]> {
  const response = await apiRequest<any[]>({
    url: `/professional/dashboard/upcoming-appointments?limit=${limit}`,
    method: "GET",
  })

  return response.map((apt) => ({
    ...apt,
    scheduledDate: new Date(apt.scheduledDate),
    createdAt: new Date(apt.createdAt),
    updatedAt: new Date(apt.updatedAt),
  }))
}

// Get recent activities
export async function getProfessionalRecentActivities(limit = 10): Promise<Activity[]> {
  const response = await apiRequest<any[]>({
    url: `/professional/dashboard/activities?limit=${limit}`,
    method: "GET",
  })

  return response.map((activity) => ({
    ...activity,
    timestamp: new Date(activity.timestamp),
  }))
}

// Get weekly schedule summary
export async function getProfessionalWeeklySchedule(): Promise<WeeklySchedule[]> {
  return apiRequest<WeeklySchedule[]>({
    url: "/professional/dashboard/weekly-schedule",
    method: "GET",
  })
}

// Get monthly performance trend
export async function getProfessionalMonthlyTrend(): Promise<MonthlyTrend> {
  return apiRequest<MonthlyTrend>({
    url: "/professional/dashboard/monthly-trend",
    method: "GET",
  })
}

// Get today's appointments
export async function getProfessionalTodayAppointments(): Promise<Appointment[]> {
  const response = await apiRequest<any[]>({
    url: "/professional/dashboard/today-appointments",
    method: "GET",
  })

  return response.map((apt) => ({
    ...apt,
    scheduledDate: new Date(apt.scheduledDate),
    createdAt: new Date(apt.createdAt),
    updatedAt: new Date(apt.updatedAt),
  }))
}

// Get pending check-ins
export async function getProfessionalPendingCheckIns(): Promise<Appointment[]> {
  const response = await apiRequest<any[]>({
    url: "/professional/dashboard/pending-checkins",
    method: "GET",
  })

  return response.map((apt) => ({
    ...apt,
    scheduledDate: new Date(apt.scheduledDate),
    createdAt: new Date(apt.createdAt),
    updatedAt: new Date(apt.updatedAt),
  }))
}

// Get earnings summary
export async function getProfessionalEarningsSummary(period: "daily" | "weekly" | "monthly" = "monthly"): Promise<{
  total: number
  pending: number
  paid: number
  average: number
  transactions: Array<{
    id: string
    date: Date
    amount: number
    status: "pending" | "paid" | "processing"
    description: string
  }>
}> {
  const response = await apiRequest<any>({
    url: `/professional/dashboard/earnings?period=${period}`,
    method: "GET",
  })

  return {
    ...response,
    transactions: response.transactions.map((t: any) => ({
      ...t,
      date: new Date(t.date),
    })),
  }
}

// Get performance quick stats
export async function getProfessionalQuickStats(): Promise<{
  rating: number
  totalReviews: number
  completionRate: number
  punctualityRate: number
  monthlyAppointments: number
  weeklyGrowth: number
}> {
  return apiRequest({
    url: "/professional/dashboard/quick-stats",
    method: "GET",
  })
}

// Get notifications preview for dashboard
export async function getProfessionalDashboardNotifications(limit = 5): Promise<Notification[]> {
  return apiRequest<Notification[]>({
    url: `/professional/dashboard/notifications?limit=${limit}`,
    method: "GET",
  })
}

// Mark dashboard as viewed (for analytics)
export async function markDashboardViewed(): Promise<void> {
  await apiRequest({
    url: "/professional/dashboard/viewed",
    method: "POST",
  })
}
