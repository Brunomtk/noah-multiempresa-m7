import type { Notification } from "@/types/notification"
import { getNotifications, getNotificationById, markNotificationAsRead, createNotification } from "./notifications"

// Get all notifications for a specific professional
export async function getProfessionalNotifications(
  professionalId: string,
  type?: string,
  status?: string,
  search?: string,
  startDate?: string,
  endDate?: string,
): Promise<Notification[]> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/professionals/${professionalId}/notifications?type=${type || ''}&status=${status || ''}&search=${search || ''}&startDate=${startDate || ''}&endDate=${endDate || ''}`, { method: 'GET' });

    // For development, we'll reuse the getNotifications function and filter by professionalId
    const allNotifications = await getNotifications(type, "professional", search)

    // Filter notifications for this professional
    let filteredNotifications = allNotifications.filter(
      (notification) =>
        notification.recipientId === professionalId ||
        (notification.recipientRole === "professional" && notification.recipientId === "broadcast"),
    )

    // Apply additional filters
    if (status && status !== "all") {
      filteredNotifications = filteredNotifications.filter((notification) => notification.status === status)
    }

    // Apply date filters if provided
    if (startDate) {
      const start = new Date(startDate)
      filteredNotifications = filteredNotifications.filter((notification) => new Date(notification.createdAt) >= start)
    }

    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // End of day
      filteredNotifications = filteredNotifications.filter((notification) => new Date(notification.createdAt) <= end)
    }

    return filteredNotifications
  } catch (error) {
    console.error(`Error fetching notifications for professional ${professionalId}:`, error)
    throw error
  }
}

// Get a specific notification for a professional
export async function getProfessionalNotificationById(
  professionalId: string,
  notificationId: string,
): Promise<Notification> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/professionals/${professionalId}/notifications/${notificationId}`, { method: 'GET' });

    // For development, we'll reuse the getNotificationById function and check if it belongs to the professional
    const notification = await getNotificationById(notificationId)

    // Check if the notification belongs to this professional or is a broadcast to all professionals
    if (
      notification.recipientId === professionalId ||
      (notification.recipientRole === "professional" && notification.recipientId === "broadcast")
    ) {
      return notification
    } else {
      throw new Error(`Notification with ID ${notificationId} does not belong to professional ${professionalId}`)
    }
  } catch (error) {
    console.error(`Error fetching notification ${notificationId} for professional ${professionalId}:`, error)
    throw error
  }
}

// Mark a notification as read for a professional
export async function markProfessionalNotificationAsRead(
  professionalId: string,
  notificationId: string,
): Promise<Notification> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/professionals/${professionalId}/notifications/${notificationId}/read`, { method: 'PUT' });

    // For development, we'll reuse the markNotificationAsRead function
    return await markNotificationAsRead(notificationId)
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read for professional ${professionalId}:`, error)
    throw error
  }
}

// Get unread notifications count for a professional
export async function getProfessionalUnreadNotificationsCount(professionalId: string): Promise<number> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/professionals/${professionalId}/notifications/unread/count`, { method: 'GET' });

    // For development, we'll reuse the getProfessionalNotifications function and count unread
    const notifications = await getProfessionalNotifications(professionalId)
    return notifications.filter((notification) => notification.status === "unread").length
  } catch (error) {
    console.error(`Error getting unread notifications count for professional ${professionalId}:`, error)
    throw error
  }
}

// Send feedback or response to a notification (professional to company/admin)
export async function sendProfessionalNotificationResponse(
  professionalId: string,
  notificationId: string,
  response: string,
  responseType: "confirmation" | "feedback" | "question" = "feedback",
): Promise<Notification> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/professionals/${professionalId}/notifications/${notificationId}/response`, {
    //   method: 'POST',
    //   body: JSON.stringify({ response, responseType })
    // });

    // For development, we'll create a new notification as a response
    const originalNotification = await getProfessionalNotificationById(professionalId, notificationId)

    const responseNotification = await createNotification({
      title: `Response to: ${originalNotification.title}`,
      message: response,
      type: "info",
      recipientId: originalNotification.companyId || "admin",
      recipientRole: originalNotification.companyId ? "company" : "admin",
      companyId: originalNotification.companyId,
      status: "unread",
      // Additional fields for response tracking
      originalNotificationId: notificationId,
      responseType,
      respondedBy: professionalId,
    } as any) // Using 'any' to bypass TypeScript checking for the mock implementation

    return responseNotification
  } catch (error) {
    console.error(`Error sending response to notification ${notificationId} for professional ${professionalId}:`, error)
    throw error
  }
}

// Get notification statistics for a professional
export async function getProfessionalNotificationStats(professionalId: string): Promise<{
  total: number
  unread: number
  read: number
  important: number
  thisWeek: number
  thisMonth: number
}> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/professionals/${professionalId}/notifications/stats`, { method: 'GET' });

    // For development, we'll calculate stats from the notifications
    const notifications = await getProfessionalNotifications(professionalId)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    return {
      total: notifications.length,
      unread: notifications.filter((n) => n.status === "unread").length,
      read: notifications.filter((n) => n.status === "read").length,
      important: notifications.filter((n) => n.type === "warning" || n.type === "error").length,
      thisWeek: notifications.filter((n) => new Date(n.createdAt) >= weekAgo).length,
      thisMonth: notifications.filter((n) => new Date(n.createdAt) >= monthAgo).length,
    }
  } catch (error) {
    console.error(`Error getting notification stats for professional ${professionalId}:`, error)
    throw error
  }
}

// Mark all notifications as read for a professional
export async function markAllProfessionalNotificationsAsRead(professionalId: string): Promise<void> {
  try {
    // In a real app, this would be an API call
    // await apiRequest(`/api/professionals/${professionalId}/notifications/mark-all-read`, { method: 'PUT' });

    // For development, we'll get all unread notifications and mark them as read
    const notifications = await getProfessionalNotifications(professionalId)
    const unreadNotifications = notifications.filter((n) => n.status === "unread")

    for (const notification of unreadNotifications) {
      await markNotificationAsRead(notification.id)
    }
  } catch (error) {
    console.error(`Error marking all notifications as read for professional ${professionalId}:`, error)
    throw error
  }
}

// Get notifications by priority for a professional
export async function getProfessionalNotificationsByPriority(
  professionalId: string,
  priority: "high" | "medium" | "low" = "high",
): Promise<Notification[]> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/professionals/${professionalId}/notifications/priority/${priority}`, { method: 'GET' });

    // For development, we'll filter notifications by type (using type as priority indicator)
    const notifications = await getProfessionalNotifications(professionalId)

    let filteredNotifications: Notification[] = []

    switch (priority) {
      case "high":
        filteredNotifications = notifications.filter((n) => n.type === "error" || n.type === "warning")
        break
      case "medium":
        filteredNotifications = notifications.filter((n) => n.type === "info")
        break
      case "low":
        filteredNotifications = notifications.filter((n) => n.type === "success")
        break
    }

    return filteredNotifications
  } catch (error) {
    console.error(`Error getting ${priority} priority notifications for professional ${professionalId}:`, error)
    throw error
  }
}

// Get recent notifications for a professional (last 7 days)
export async function getProfessionalRecentNotifications(professionalId: string): Promise<Notification[]> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/professionals/${professionalId}/notifications/recent`, { method: 'GET' });

    // For development, we'll filter notifications from the last 7 days
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    return await getProfessionalNotifications(professionalId, undefined, undefined, undefined, weekAgo.toISOString())
  } catch (error) {
    console.error(`Error getting recent notifications for professional ${professionalId}:`, error)
    throw error
  }
}
