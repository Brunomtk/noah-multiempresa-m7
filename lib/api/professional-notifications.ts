import { apiRequest } from "./utils"

export interface Notification {
  id: number
  title: string
  message: string
  type: number // 1: Info, 2: Warning, 3: Error, 4: Success
  status: number // 0: Unread, 1: Read
  createdDate: string
  updatedDate: string
}

// Get user ID from token
function getUserIdFromToken(): string {
  const token = localStorage.getItem("noah_token")
  if (!token) {
    throw new Error("No authentication token found")
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const userId = payload.UserId || payload.userId
    if (!userId) {
      throw new Error("User ID not found in token")
    }
    return userId
  } catch (error) {
    throw new Error("Invalid token format")
  }
}

export async function getProfessionalNotifications(): Promise<Notification[]> {
  try {
    const userId = getUserIdFromToken()
    const response = await apiRequest(`/Notifications/user/${userId}`)
    return response || []
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

export async function getProfessionalUnreadNotificationsCount(): Promise<number> {
  try {
    const userId = getUserIdFromToken()
    const response = await apiRequest(`/Notifications/user/${userId}/unread-count`)
    return response || 0
  } catch (error) {
    console.error("Error fetching unread count:", error)
    return 0
  }
}

export async function getProfessionalNotificationStats() {
  const notifications = await getProfessionalNotifications()
  const unreadCount = await getProfessionalUnreadNotificationsCount()

  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const thisWeek = notifications.filter((n) => new Date(n.createdDate) >= oneWeekAgo).length
  const thisMonth = notifications.filter((n) => new Date(n.createdDate) >= oneMonthAgo).length
  const important = notifications.filter((n) => n.type === 2 || n.type === 3).length

  return {
    total: notifications.length,
    unread: unreadCount,
    read: notifications.length - unreadCount,
    important,
    thisWeek,
    thisMonth,
  }
}

export function filterNotificationsByType(notifications: Notification[], type: string): Notification[] {
  switch (type) {
    case "unread":
      return notifications.filter((n) => n.status === 0)
    case "important":
      return notifications.filter((n) => n.type === 2 || n.type === 3)
    default:
      return notifications
  }
}

export function getNotificationTypeLabel(type: number): string {
  switch (type) {
    case 1:
      return "Info"
    case 2:
      return "Warning"
    case 3:
      return "Error"
    case 4:
      return "Success"
    default:
      return "Unknown"
  }
}

export function getNotificationTypeColor(type: number): string {
  switch (type) {
    case 1:
      return "blue"
    case 2:
      return "yellow"
    case 3:
      return "red"
    case 4:
      return "green"
    default:
      return "gray"
  }
}

export function formatNotificationDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) {
    return "Just now"
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours} h ago`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days} d ago`
  }
}
