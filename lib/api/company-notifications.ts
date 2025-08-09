import type { Notification } from "@/types/notification"
import { fetchApi } from "./utils"

// Helper to parse JWT from localStorage
function getToken(): string {
  const t = localStorage.getItem("noah_token") || localStorage.getItem("authToken") || localStorage.getItem("token")
  if (!t) throw new Error("No authentication token found")
  return t
}

// Extract CompanyId or UserId from JWT payload
function parseJwtField(field: string): string {
  try {
    const token = getToken()
    const payload = JSON.parse(atob(token.split(".")[1]))
    return String(payload[field] ?? payload[field.toLowerCase()] ?? payload[field.toUpperCase()] ?? "")
  } catch {
    return ""
  }
}

// Get companyId from token
function getCompanyIdFromToken(): string {
  return parseJwtField("CompanyId") || "1"
}

// Get userId from token
function getUserIdFromToken(): string {
  return parseJwtField("UserId") || "1"
}

// Get all notifications for the company
export async function getCompanyNotifications(): Promise<Notification[]> {
  try {
    const companyId = getCompanyIdFromToken()
    const data = await fetchApi<Notification[]>(`/Notifications?CompanyId=${companyId}`)
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("Error fetching company notifications:", err)
    // Fallback mock data
    return [
      {
        id: 1,
        title: "Welcome to Noah Platform",
        message: "Welcome to the Noah platform. This is a sample notification.",
        type: 1,
        status: 0,
        createdDate: new Date().toISOString(),
        sentAt: new Date().toISOString(),
        readAt: null,
        companyId: 1,
        userId: 1,
      },
      {
        id: 2,
        title: "System Update",
        message: "The system has been updated with new features.",
        type: 2,
        status: 1,
        createdDate: new Date(Date.now() - 86400000).toISOString(),
        sentAt: new Date(Date.now() - 86400000).toISOString(),
        readAt: new Date().toISOString(),
        companyId: 1,
        userId: 1,
      },
    ]
  }
}

// Get a specific notification by ID
export async function getCompanyNotificationById(id: string): Promise<Notification> {
  return await fetchApi<Notification>(`/Notifications/${id}`)
}

// Create a new notification
export async function createCompanyNotification(data: {
  title: string
  message: string
  type: string
  recipientRole: string
  recipientIds: number[]
  isBroadcast: boolean
  companyId: number
}): Promise<Notification> {
  return await fetchApi<Notification>(`/Notifications`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Update an existing notification
export async function updateCompanyNotification(
  id: string,
  data: {
    title?: string
    message?: string
    type?: string
    status?: string
    readAt?: string
  },
): Promise<Notification> {
  return await fetchApi<Notification>(`/Notifications/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// Delete a notification
export async function deleteCompanyNotification(id: string): Promise<void> {
  await fetchApi<void>(`/Notifications/${id}`, { method: "DELETE" })
}

// Mark notification as read
export async function markCompanyNotificationAsRead(id: string): Promise<Notification> {
  return await fetchApi<Notification>(`/Notifications/${id}/read`, { method: "POST" })
}

// Get notifications for the current user
export async function getUserNotifications(): Promise<Notification[]> {
  const userId = getUserIdFromToken()
  const data = await fetchApi<Notification[]>(`/Notifications/user/${userId}`)
  return Array.isArray(data) ? data : []
}

// Get unread notifications count for the current user
export async function getCompanyUnreadNotificationsCount(): Promise<number> {
  const userId = getUserIdFromToken()
  const data = await fetchApi<number>(`/Notifications/user/${userId}/unread-count`)
  return typeof data === "number" ? data : 0
}

// Send notification to professionals
export async function sendCompanyNotificationToProfessionals(data: {
  title: string
  message: string
  professionalIds: number[]
  companyId: number
}): Promise<Notification[]> {
  try {
    const response = await fetchApi<Notification[]>(`/Notifications/send-to-professionals`, {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response
  } catch (error) {
    console.error("Error sending notification to professionals:", error)
    throw error
  }
}

// Broadcast notification to all company members
export async function broadcastCompanyNotification(data: {
  title: string
  message: string
  companyId: number
  type?: number
}): Promise<Notification> {
  try {
    const response = await fetchApi<Notification>(`/Notifications/broadcast`, {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response
  } catch (error) {
    console.error("Error broadcasting notification:", error)
    throw error
  }
}

// Get company notification statistics
export async function getCompanyNotificationStats(): Promise<{
  total: number
  unread: number
  read: number
  thisWeek: number
  thisMonth: number
  byType: Record<string, number>
}> {
  try {
    const companyId = getCompanyIdFromToken()
    const notifications = await getCompanyNotifications()

    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const unreadCount = notifications.filter((n) => n.status === 0).length
    const thisWeek = notifications.filter((n) => new Date(n.createdDate) >= oneWeekAgo).length
    const thisMonth = notifications.filter((n) => new Date(n.createdDate) >= oneMonthAgo).length

    const byType = notifications.reduce(
      (acc, notification) => {
        const typeKey = `type_${notification.type}`
        acc[typeKey] = (acc[typeKey] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total: notifications.length,
      unread: unreadCount,
      read: notifications.length - unreadCount,
      thisWeek,
      thisMonth,
      byType,
    }
  } catch (error) {
    console.error("Error getting notification stats:", error)
    return {
      total: 0,
      unread: 0,
      read: 0,
      thisWeek: 0,
      thisMonth: 0,
      byType: {},
    }
  }
}
