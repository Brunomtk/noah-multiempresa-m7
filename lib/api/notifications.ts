import type { Notification } from "@/types/notification"

// Mock data for development
const mockNotifications: Notification[] = Array.from({ length: 20 }).map((_, index) => ({
  id: `notification-${index + 1}`,
  title: `Notification ${index + 1}`,
  message: `This is a notification message ${index + 1}. It contains important information for the recipient.`,
  type: ["info", "warning", "error", "success"][Math.floor(Math.random() * 4)] as
    | "info"
    | "warning"
    | "error"
    | "success",
  recipientId: `user-${Math.floor(Math.random() * 10) + 1}`,
  recipientRole: ["admin", "company", "professional"][Math.floor(Math.random() * 3)] as
    | "admin"
    | "company"
    | "professional",
  companyId: Math.random() > 0.5 ? `company-${Math.floor(Math.random() * 5) + 1}` : undefined,
  status: Math.random() > 0.3 ? "unread" : "read",
  sentAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  readAt:
    Math.random() > 0.3
      ? new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString()
      : undefined,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString(),
}))

// Get all notifications with optional filters
export async function getNotifications(
  type?: string,
  recipientRole?: string,
  search?: string,
): Promise<Notification[]> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/notifications?type=${type || ''}&recipientRole=${recipientRole || ''}&search=${search || ''}`, { method: 'GET' });

    // For development, filter the mock data
    let filteredNotifications = [...mockNotifications]

    if (type && type !== "all") {
      filteredNotifications = filteredNotifications.filter((notification) => notification.type === type)
    }

    if (recipientRole && recipientRole !== "all") {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.recipientRole === recipientRole,
      )
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredNotifications = filteredNotifications.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchLower) ||
          notification.message.toLowerCase().includes(searchLower),
      )
    }

    return filteredNotifications
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }
}

// Get a specific notification by ID
export async function getNotificationById(id: string): Promise<Notification> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/notifications/${id}`, { method: 'GET' });

    // For development, find in mock data
    const notification = mockNotifications.find((n) => n.id === id)
    if (!notification) {
      throw new Error(`Notification with ID ${id} not found`)
    }
    return notification
  } catch (error) {
    console.error(`Error fetching notification with ID ${id}:`, error)
    throw error
  }
}

// Create a new notification
export async function createNotification(
  notificationData: Omit<Notification, "id" | "createdAt" | "updatedAt" | "sentAt">,
): Promise<Notification> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest('/api/notifications', {
    //   method: 'POST',
    //   body: JSON.stringify(notificationData)
    // });

    // For development, create a new notification
    const newNotification: Notification = {
      ...notificationData,
      id: `notification-${mockNotifications.length + 1}`,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockNotifications.unshift(newNotification)
    return newNotification
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

// Update an existing notification
export async function updateNotification(id: string, notificationData: Partial<Notification>): Promise<Notification> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/notifications/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(notificationData)
    // });

    // For development, update in mock data
    const index = mockNotifications.findIndex((n) => n.id === id)
    if (index === -1) {
      throw new Error(`Notification with ID ${id} not found`)
    }

    const updatedNotification = {
      ...mockNotifications[index],
      ...notificationData,
      updatedAt: new Date().toISOString(),
    }

    mockNotifications[index] = updatedNotification
    return updatedNotification
  } catch (error) {
    console.error(`Error updating notification with ID ${id}:`, error)
    throw error
  }
}

// Delete a notification
export async function deleteNotification(id: string): Promise<void> {
  try {
    // In a real app, this would be an API call
    // await apiRequest(`/api/notifications/${id}`, { method: 'DELETE' });

    // For development, remove from mock data
    const index = mockNotifications.findIndex((n) => n.id === id)
    if (index === -1) {
      throw new Error(`Notification with ID ${id} not found`)
    }

    mockNotifications.splice(index, 1)
  } catch (error) {
    console.error(`Error deleting notification with ID ${id}:`, error)
    throw error
  }
}

// Mark a notification as read
export async function markNotificationAsRead(id: string): Promise<Notification> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/notifications/${id}/read`, { method: 'PUT' });

    // For development, update in mock data
    const index = mockNotifications.findIndex((n) => n.id === id)
    if (index === -1) {
      throw new Error(`Notification with ID ${id} not found`)
    }

    const updatedNotification = {
      ...mockNotifications[index],
      status: "read",
      readAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockNotifications[index] = updatedNotification
    return updatedNotification
  } catch (error) {
    console.error(`Error marking notification with ID ${id} as read:`, error)
    throw error
  }
}

// Send a notification to specific recipients
export async function sendNotification(
  title: string,
  message: string,
  type: "info" | "warning" | "error" | "success",
  recipientIds: string[],
  recipientRole: "admin" | "company" | "professional",
  companyId?: string,
): Promise<Notification[]> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest('/api/notifications/send', {
    //   method: 'POST',
    //   body: JSON.stringify({ title, message, type, recipientIds, recipientRole, companyId })
    // });

    // For development, create new notifications for each recipient
    const newNotifications: Notification[] = recipientIds.map((recipientId, index) => {
      const notification: Notification = {
        id: `notification-${mockNotifications.length + index + 1}`,
        title,
        message,
        type,
        recipientId,
        recipientRole,
        companyId,
        status: "unread",
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockNotifications.unshift(notification)
      return notification
    })

    return newNotifications
  } catch (error) {
    console.error("Error sending notifications:", error)
    throw error
  }
}

// Broadcast a notification to all users of a certain role
export async function broadcastNotification(
  title: string,
  message: string,
  type: "info" | "warning" | "error" | "success",
  recipientRole: "admin" | "company" | "professional",
  companyId?: string,
): Promise<Notification> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest('/api/notifications/broadcast', {
    //   method: 'POST',
    //   body: JSON.stringify({ title, message, type, recipientRole, companyId })
    // });

    // For development, create a broadcast notification
    const broadcastNotification: Notification = {
      id: `notification-broadcast-${mockNotifications.length + 1}`,
      title,
      message,
      type,
      recipientId: "broadcast",
      recipientRole,
      companyId,
      status: "unread",
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockNotifications.unshift(broadcastNotification)
    return broadcastNotification
  } catch (error) {
    console.error("Error broadcasting notification:", error)
    throw error
  }
}

// Get unread notifications count for a user
export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/notifications/unread/count?userId=${userId}`, { method: 'GET' });

    // For development, count unread notifications for the user
    return mockNotifications.filter((n) => n.recipientId === userId && n.status === "unread").length
  } catch (error) {
    console.error(`Error getting unread notifications count for user ${userId}:`, error)
    throw error
  }
}

// Get notifications for a specific user
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  try {
    // In a real app, this would be an API call
    // return await apiRequest(`/api/notifications/user/${userId}`, { method: 'GET' });

    // For development, filter notifications for the user
    return mockNotifications.filter((n) => n.recipientId === userId || n.recipientId === "broadcast")
  } catch (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error)
    throw error
  }
}
