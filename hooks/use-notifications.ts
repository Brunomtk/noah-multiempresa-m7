import { useNotificationsContext } from "@/contexts/notifications-context"
import type { NotificationFormData, NotificationFilters } from "@/types/notification"
import { formatDistanceToNow } from "date-fns"

export function useNotifications() {
  const context = useNotificationsContext()

  // Format the notification date for display
  const formatNotificationDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  // Get the appropriate color for a notification type
  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "success":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get the appropriate icon for a notification type
  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return "info-circle"
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

  // Get the appropriate label for a recipient role
  const getRecipientRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "company":
        return "Company"
      case "professional":
        return "Professional"
      default:
        return role
    }
  }

  // Get the appropriate color for a notification status
  const getNotificationStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-blue-100 text-blue-800"
      case "read":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Create a new notification
  const createNotification = async (data: NotificationFormData) => {
    await context.addNotification(data)
  }

  // Update notification filters
  const updateFilters = (filters: Partial<NotificationFilters>) => {
    context.setFilters(filters)
  }

  // Get notification type options for filtering
  const getNotificationTypeOptions = () => [
    { value: "all", label: "All Types" },
    { value: "info", label: "Information" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" },
    { value: "success", label: "Success" },
  ]

  // Get recipient role options for filtering
  const getRecipientRoleOptions = () => [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Administrators" },
    { value: "company", label: "Companies" },
    { value: "professional", label: "Professionals" },
  ]

  // Get notification type options for creating
  const getNotificationTypeCreateOptions = () => [
    { value: "info", label: "Information" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" },
    { value: "success", label: "Success" },
  ]

  // Get recipient role options for creating
  const getRecipientRoleCreateOptions = () => [
    { value: "admin", label: "Administrators" },
    { value: "company", label: "Companies" },
    { value: "professional", label: "Professionals" },
  ]

  return {
    ...context,
    formatNotificationDate,
    getNotificationTypeColor,
    getNotificationTypeIcon,
    getRecipientRoleLabel,
    getNotificationStatusColor,
    createNotification,
    updateFilters,
    getNotificationTypeOptions,
    getRecipientRoleOptions,
    getNotificationTypeCreateOptions,
    getRecipientRoleCreateOptions,
  }
}
