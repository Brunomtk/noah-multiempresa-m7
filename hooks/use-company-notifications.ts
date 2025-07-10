import { useCompanyNotificationsContext } from "@/contexts/company-notifications-context"
import { formatDistanceToNow } from "date-fns"
import type { Notification } from "@/types/notification"

interface NotificationFormData {
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  isBroadcast: boolean
  professionalIds?: string[]
  requiresConfirmation: boolean
  isScheduled: boolean
  scheduledFor?: string
  attachments?: File[]
}

export function useCompanyNotifications(companyId: string) {
  const context = useCompanyNotificationsContext()

  // Format the notification date for display
  const formatNotificationDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  // Get the appropriate color for a notification type
  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
    }
  }

  // Get the appropriate badge color for a notification priority
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
      case "normal":
        return "bg-[#06b6d4] text-white"
      case "high":
        return "bg-yellow-500 text-white"
      case "urgent":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
    }
  }

  // Get the appropriate badge color for a notification status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-500 text-white"
      case "scheduled":
        return "bg-[#06b6d4] text-white"
      case "draft":
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
    }
  }

  // Get the appropriate icon for a notification type
  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return "info"
      case "warning":
        return "alert-triangle"
      case "error":
        return "alert-octagon"
      case "success":
        return "check-circle"
      default:
        return "bell"
    }
  }

  // Get notification type options for filtering
  const getNotificationTypeOptions = () => [
    { value: "all", label: "All Types" },
    { value: "info", label: "Information" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" },
    { value: "success", label: "Success" },
  ]

  // Get notification status options for filtering
  const getNotificationStatusOptions = () => [
    { value: "all", label: "All Statuses" },
    { value: "unread", label: "Unread" },
    { value: "read", label: "Read" },
  ]

  // Get notification priority options for creating
  const getNotificationPriorityOptions = () => [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ]

  // Get notification type options for creating
  const getNotificationTypeCreateOptions = () => [
    { value: "info", label: "Information" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" },
    { value: "success", label: "Success" },
  ]

  // Fetch notifications for this company
  const fetchCompanyNotifications = async () => {
    await context.fetchNotifications(companyId)
  }

  // Fetch a specific notification
  const fetchCompanyNotificationById = async (id: string) => {
    await context.fetchNotificationById(companyId, id)
  }

  // Send a notification
  const sendCompanyNotification = async (data: NotificationFormData) => {
    await context.sendNotification(companyId, data)
  }

  // Update a notification
  const updateCompanyNotification = async (id: string, data: Partial<Notification>) => {
    await context.updateNotification(companyId, id, data)
  }

  // Delete a notification
  const deleteCompanyNotification = async (id: string) => {
    await context.deleteNotification(companyId, id)
  }

  // Mark a notification as read
  const markCompanyNotificationAsRead = async (id: string) => {
    await context.markAsRead(companyId, id)
  }

  // Fetch notification stats
  const fetchCompanyNotificationStats = async () => {
    await context.fetchStats(companyId)
  }

  // Fetch unread count
  const fetchCompanyUnreadCount = async () => {
    await context.fetchUnreadCount(companyId)
  }

  return {
    ...context,
    formatNotificationDate,
    getNotificationTypeColor,
    getPriorityBadgeColor,
    getStatusBadgeColor,
    getNotificationTypeIcon,
    getNotificationTypeOptions,
    getNotificationStatusOptions,
    getNotificationPriorityOptions,
    getNotificationTypeCreateOptions,
    fetchCompanyNotifications,
    fetchCompanyNotificationById,
    sendCompanyNotification,
    updateCompanyNotification,
    deleteCompanyNotification,
    markCompanyNotificationAsRead,
    fetchCompanyNotificationStats,
    fetchCompanyUnreadCount,
  }
}
