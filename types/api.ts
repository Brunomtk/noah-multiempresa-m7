// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  status: number
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}
