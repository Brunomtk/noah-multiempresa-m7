import { apiRequest } from "./utils"
import type {
  PerformanceMetrics,
  PerformanceGoal,
  Achievement,
  PerformanceRanking,
  PerformanceReport,
  PerformanceComparison,
} from "@/types/performance"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface GetPerformanceMetricsParams {
  period?: "daily" | "weekly" | "monthly" | "yearly"
  startDate?: string
  endDate?: string
}

export interface CreateGoalData {
  title: string
  description: string
  targetValue: number
  unit: string
  category: "rating" | "punctuality" | "productivity" | "revenue" | "efficiency"
  deadline: string
}

export interface UpdateGoalData extends Partial<CreateGoalData> {
  currentValue?: number
  status?: "active" | "completed" | "overdue" | "cancelled"
}

// Métricas de Performance
export async function getPerformanceMetrics(
  professionalId: string,
  params?: GetPerformanceMetricsParams,
): Promise<PerformanceMetrics[]> {
  const queryParams = new URLSearchParams()
  if (params?.period) queryParams.append("period", params.period)
  if (params?.startDate) queryParams.append("startDate", params.startDate)
  if (params?.endDate) queryParams.append("endDate", params.endDate)

  const response = await apiRequest(
    `${API_BASE}/api/professionals/${professionalId}/performance/metrics?${queryParams}`,
  )

  return response.map((metric: any) => ({
    ...metric,
    startDate: new Date(metric.startDate),
    endDate: new Date(metric.endDate),
    createdAt: new Date(metric.createdAt),
    updatedAt: new Date(metric.updatedAt),
  }))
}

export async function getCurrentPerformanceMetrics(professionalId: string): Promise<PerformanceMetrics> {
  const response = await apiRequest(`${API_BASE}/api/professionals/${professionalId}/performance/current`)

  return {
    ...response,
    startDate: new Date(response.startDate),
    endDate: new Date(response.endDate),
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  }
}

// Metas e Objetivos
export async function getPerformanceGoals(professionalId: string): Promise<PerformanceGoal[]> {
  const response = await apiRequest(`${API_BASE}/api/professionals/${professionalId}/performance/goals`)

  return response.map((goal: any) => ({
    ...goal,
    deadline: new Date(goal.deadline),
    createdAt: new Date(goal.createdAt),
    updatedAt: new Date(goal.updatedAt),
  }))
}

export async function createPerformanceGoal(
  professionalId: string,
  goalData: CreateGoalData,
): Promise<PerformanceGoal> {
  const response = await apiRequest(`${API_BASE}/api/professionals/${professionalId}/performance/goals`, {
    method: "POST",
    body: JSON.stringify(goalData),
  })

  return {
    ...response,
    deadline: new Date(response.deadline),
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  }
}

export async function updatePerformanceGoal(
  professionalId: string,
  goalId: string,
  goalData: UpdateGoalData,
): Promise<PerformanceGoal> {
  const response = await apiRequest(`${API_BASE}/api/professionals/${professionalId}/performance/goals/${goalId}`, {
    method: "PUT",
    body: JSON.stringify(goalData),
  })

  return {
    ...response,
    deadline: new Date(response.deadline),
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  }
}

export async function deletePerformanceGoal(professionalId: string, goalId: string): Promise<void> {
  await apiRequest(`${API_BASE}/api/professionals/${professionalId}/performance/goals/${goalId}`, { method: "DELETE" })
}

// Conquistas
export async function getAchievements(professionalId: string): Promise<Achievement[]> {
  const response = await apiRequest(`${API_BASE}/api/professionals/${professionalId}/performance/achievements`)

  return response.map((achievement: any) => ({
    ...achievement,
    earnedAt: new Date(achievement.earnedAt),
  }))
}

// Rankings
export async function getPerformanceRanking(
  professionalId: string,
  category: "overall" | "rating" | "punctuality" | "productivity" = "overall",
  period: "weekly" | "monthly" | "yearly" = "monthly",
): Promise<PerformanceRanking[]> {
  const response = await apiRequest(
    `${API_BASE}/api/professionals/${professionalId}/performance/ranking?category=${category}&period=${period}`,
  )

  return response
}

// Comparações
export async function getPerformanceComparisons(
  professionalId: string,
  period: "weekly" | "monthly" | "yearly" = "monthly",
): Promise<PerformanceComparison[]> {
  const response = await apiRequest(
    `${API_BASE}/api/professionals/${professionalId}/performance/comparisons?period=${period}`,
  )

  return response
}

// Relatórios
export async function generatePerformanceReport(professionalId: string, period: string): Promise<PerformanceReport> {
  const response = await apiRequest(`${API_BASE}/api/professionals/${professionalId}/performance/reports`, {
    method: "POST",
    body: JSON.stringify({ period }),
  })

  return {
    ...response,
    metrics: {
      ...response.metrics,
      startDate: new Date(response.metrics.startDate),
      endDate: new Date(response.metrics.endDate),
      createdAt: new Date(response.metrics.createdAt),
      updatedAt: new Date(response.metrics.updatedAt),
    },
    goals: response.goals.map((goal: any) => ({
      ...goal,
      deadline: new Date(goal.deadline),
      createdAt: new Date(goal.createdAt),
      updatedAt: new Date(goal.updatedAt),
    })),
    achievements: response.achievements.map((achievement: any) => ({
      ...achievement,
      earnedAt: new Date(achievement.earnedAt),
    })),
    generatedAt: new Date(response.generatedAt),
  }
}

export async function getPerformanceReports(professionalId: string): Promise<PerformanceReport[]> {
  const response = await apiRequest(`${API_BASE}/api/professionals/${professionalId}/performance/reports`)

  return response.map((report: any) => ({
    ...report,
    metrics: {
      ...report.metrics,
      startDate: new Date(report.metrics.startDate),
      endDate: new Date(report.metrics.endDate),
      createdAt: new Date(report.metrics.createdAt),
      updatedAt: new Date(report.metrics.updatedAt),
    },
    goals: report.goals.map((goal: any) => ({
      ...goal,
      deadline: new Date(goal.deadline),
      createdAt: new Date(goal.createdAt),
      updatedAt: new Date(goal.updatedAt),
    })),
    achievements: report.achievements.map((achievement: any) => ({
      ...achievement,
      earnedAt: new Date(achievement.earnedAt),
    })),
    generatedAt: new Date(report.generatedAt),
  }))
}
