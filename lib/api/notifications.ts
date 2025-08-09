import type { Notification, NotificationFilters, CreateNotificationData } from "@/types/notification"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export async function getNotifications(filters?: NotificationFilters) {
  try {
    const queryParams = new URLSearchParams()

    if (filters?.search) queryParams.append("search", filters.search)
    if (filters?.type) queryParams.append("type", filters.type)
    if (filters?.isRead !== undefined) queryParams.append("isRead", filters.isRead.toString())
    if (filters?.userId) queryParams.append("userId", filters.userId)
    if (filters?.page) queryParams.append("page", filters.page.toString())
    if (filters?.limit) queryParams.append("limit", filters.limit.toString())

    const response = await fetch(`${API_BASE_URL}/notifications?${queryParams}`)

    if (!response.ok) {
      throw new Error("Failed to fetch notifications")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching notifications:", error)
    // Return mock data for development
    return {
      notifications: [],
      totalCount: 0,
      totalPages: 0,
      stats: {
        totalNotifications: 0,
        unreadNotifications: 0,
        readNotifications: 0,
      },
    }
  }
}

export async function getNotification(id: string): Promise<Notification | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`)

    if (!response.ok) {
      throw new Error("Failed to fetch notification")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching notification:", error)
    return null
  }
}

export async function createNotification(data: CreateNotificationData): Promise<Notification> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to create notification")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

export async function updateNotification(id: string, data: Partial<Notification>): Promise<Notification> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to update notification")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating notification:", error)
    throw error
  }
}

export async function deleteNotification(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete notification")
    }
  } catch (error) {
    console.error("Error deleting notification:", error)
    throw error
  }
}

export async function markNotificationAsRead(id: string): Promise<Notification> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: "PUT",
    })

    if (!response.ok) {
      throw new Error("Failed to mark notification as read")
    }

    return await response.json()
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read")
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}

export async function sendNotification(data: CreateNotificationData): Promise<Notification> {
  return createNotification(data)
}

export async function broadcastNotification(
  data: Omit<CreateNotificationData, "userId"> & { userIds: string[] },
): Promise<Notification[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to broadcast notification")
    }

    return await response.json()
  } catch (error) {
    console.error("Error broadcasting notification:", error)
    throw error
  }
}
