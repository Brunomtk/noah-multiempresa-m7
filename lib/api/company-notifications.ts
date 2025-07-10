import type { Notification } from "@/types/notification"
import { getNotifications, getNotificationById, markNotificationAsRead, createNotification } from "./notifications"

// Get all notifications for a specific company
export async function getCompanyNotifications(
  companyId: string,
  type?: string,
  status?: string,
  search?: string,
  startDate?: string,
  endDate?: string,
): Promise<Notification[]> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/companies/${companyId}/notifications?type=${type || ''}&status=${status || ''}&search=${search || ''}&startDate=${startDate || ''}&endDate=${endDate || ''}`, { method: 'GET' });

    // For development, we'll reuse the getNotifications function and filter by companyId
    const allNotifications = await getNotifications(type, "company", search)

    // Filter notifications for this company
    let filteredNotifications = allNotifications.filter(
      (notification) =>
        notification.companyId === companyId ||
        (notification.recipientRole === "company" && notification.recipientId === "broadcast"),
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
    console.error(`Error fetching notifications for company ${companyId}:`, error)
    throw error
  }
}

// Get a specific notification for a company
export async function getCompanyNotificationById(companyId: string, notificationId: string): Promise<Notification> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/companies/${companyId}/notifications/${notificationId}`, { method: 'GET' });

    // For development, we'll reuse the getNotificationById function and check if it belongs to the company
    const notification = await getNotificationById(notificationId)

    // Check if the notification belongs to this company or is a broadcast to all companies
    if (
      notification.companyId === companyId ||
      (notification.recipientRole === "company" && notification.recipientId === "broadcast")
    ) {
      return notification
    } else {
      throw new Error(`Notification with ID ${notificationId} does not belong to company ${companyId}`)
    }
  } catch (error) {
    console.error(`Error fetching notification ${notificationId} for company ${companyId}:`, error)
    throw error
  }
}

// Mark a notification as read for a company
export async function markCompanyNotificationAsRead(companyId: string, notificationId: string): Promise<Notification> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/companies/${companyId}/notifications/${notificationId}/read`, { method: 'PUT' });

    // For development, we'll reuse the markNotificationAsRead function
    return await markNotificationAsRead(notificationId)
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read for company ${companyId}:`, error)
    throw error
  }
}

// Get unread notifications count for a company
export async function getCompanyUnreadNotificationsCount(companyId: string): Promise<number> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/companies/${companyId}/notifications/unread/count`, { method: 'GET' });

    // For development, we'll reuse the getCompanyNotifications function and count unread
    const notifications = await getCompanyNotifications(companyId)
    return notifications.filter((notification) => notification.status === "unread").length
  } catch (error) {
    console.error(`Error getting unread notifications count for company ${companyId}:`, error)
    throw error
  }
}

// Send a notification to company professionals
export async function sendCompanyNotificationToProfessionals(
  companyId: string,
  title: string,
  message: string,
  type: "info" | "warning" | "error" | "success",
  professionalIds: string[],
  requiresConfirmation = false,
  scheduledFor?: string,
  attachments?: { name: string; url: string }[],
): Promise<Notification[]> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/companies/${companyId}/notifications/send`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     title,
    //     message,
    //     type,
    //     professionalIds,
    //     requiresConfirmation,
    //     scheduledFor,
    //     attachments
    //   })
    // });

    // For development, we'll create a notification for each professional
    const notifications: Notification[] = []

    for (const professionalId of professionalIds) {
      const notification = await createNotification({
        title,
        message,
        type,
        recipientId: professionalId,
        recipientRole: "professional",
        companyId,
        status: "unread",
        // Additional fields specific to company notifications
        requiresConfirmation,
        scheduledFor,
        attachments,
      } as any) // Using 'any' to bypass TypeScript checking for the mock implementation

      notifications.push(notification)
    }

    return notifications
  } catch (error) {
    console.error(`Error sending notifications to professionals for company ${companyId}:`, error)
    throw error
  }
}

// Broadcast a notification to all professionals in a company
export async function broadcastCompanyNotification(
  companyId: string,
  title: string,
  message: string,
  type: "info" | "warning" | "error" | "success",
  requiresConfirmation = false,
  scheduledFor?: string,
  attachments?: { name: string; url: string }[],
): Promise<Notification> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/companies/${companyId}/notifications/broadcast`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     title,
    //     message,
    //     type,
    //     requiresConfirmation,
    //     scheduledFor,
    //     attachments
    //   })
    // });

    // For development, we'll create a broadcast notification
    return await createNotification({
      title,
      message,
      type,
      recipientId: "broadcast",
      recipientRole: "professional",
      companyId,
      status: "unread",
      // Additional fields specific to company notifications
      requiresConfirmation,
      scheduledFor,
      attachments,
    } as any) // Using 'any' to bypass TypeScript checking for the mock implementation
  } catch (error) {
    console.error(`Error broadcasting notification for company ${companyId}:`, error)
    throw error
  }
}

// Get notification statistics for a company
export async function getCompanyNotificationStats(companyId: string): Promise<{
  total: number
  unread: number
  read: number
  sent: number
  scheduled: number
  draft: number
}> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/companies/${companyId}/notifications/stats`, { method: 'GET' });

    // For development, we'll calculate stats from the notifications
    const notifications = await getCompanyNotifications(companyId)

    return {
      total: notifications.length,
      unread: notifications.filter((n) => n.status === "unread").length,
      read: notifications.filter((n) => n.status === "read").length,
      sent: notifications.filter((n) => n.sentAt !== undefined && n.sentAt !== null).length,
      scheduled: notifications.filter((n) => n.scheduledFor !== undefined && n.scheduledFor !== null).length,
      draft: notifications.filter((n) => n.sentAt === undefined && n.scheduledFor === undefined).length,
    }
  } catch (error) {
    console.error(`Error getting notification stats for company ${companyId}:`, error)
    throw error
  }
}

// Delete a notification (only drafts and scheduled)
export async function deleteCompanyNotification(companyId: string, notificationId: string): Promise<void> {
  try {
    // In a real app, this would be an API call
    // await apiRequest(`/api/companies/${companyId}/notifications/${notificationId}`, { method: 'DELETE' });

    // For development, we'll just log the action
    console.log(`Deleting notification ${notificationId} for company ${companyId}`)
    // In a real implementation, you would call the deleteNotification function
  } catch (error) {
    console.error(`Error deleting notification ${notificationId} for company ${companyId}:`, error)
    throw error
  }
}

// Update a notification (only drafts and scheduled)
export async function updateCompanyNotification(
  companyId: string,
  notificationId: string,
  data: Partial<Notification>,
): Promise<Notification> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/companies/${companyId}/notifications/${notificationId}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(data)
    // });

    // For development, we'll just log the action
    console.log(`Updating notification ${notificationId} for company ${companyId}`, data)
    // In a real implementation, you would call the updateNotification function

    // Return a mock updated notification
    return {
      id: notificationId,
      title: data.title || "Updated Notification",
      message: data.message || "This notification has been updated",
      type: data.type || "info",
      recipientId: "mock-recipient",
      recipientRole: "professional",
      companyId,
      status: data.status || "unread",
      sentAt: data.sentAt,
      readAt: data.readAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Additional fields
      requiresConfirmation: data.requiresConfirmation,
      scheduledFor: data.scheduledFor,
      attachments: data.attachments,
    } as Notification
  } catch (error) {
    console.error(`Error updating notification ${notificationId} for company ${companyId}:`, error)
    throw error
  }
}
