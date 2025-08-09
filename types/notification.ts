export interface Notification {
  id: number
  title: string
  message: string
  type: number // 1=Info, 2=Warning, 3=Error, 4=Success
  recipientId: number
  recipientRole: number // 0=Admin, 1=Company, 2=Professional
  companyId: number
  status: number // 0=Unread, 1=Read
  sentAt: string | null
  readAt: string | null
  createdDate: string
  updatedDate: string
}

export interface NotificationCreateData {
  title: string
  message: string
  type: string
  recipientRole: string
  recipientIds: number[]
  isBroadcast: boolean
  companyId: number
}

export interface NotificationUpdateData {
  title?: string
  message?: string
  type?: string
  status?: string
  readAt?: string
}

export enum NotificationType {
  Info = 1,
  Warning = 2,
  Error = 3,
  Success = 4,
}

export enum NotificationStatus {
  Unread = 0,
  Read = 1,
}

export enum RecipientRole {
  Admin = 0,
  Company = 1,
  Professional = 2,
}
