import type { UserRole } from "./user"

// Notification Types
export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  recipientId: string
  recipientRole: UserRole
  companyId?: string
  status: "unread" | "read"
  sentAt: string
  readAt?: string
  createdAt: string
  updatedAt: string
}

// Notification Form Data
export interface NotificationFormData {
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  recipientRole: UserRole
  recipientIds?: string[]
  companyId?: string
  isBroadcast: boolean
}

// Notification Filters
export interface NotificationFilters {
  type: string
  recipientRole: string
  search: string
}
