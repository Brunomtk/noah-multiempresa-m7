import type { Review, ReviewFormData } from "@/types/review"

// Mock data for development
const mockReviews: Review[] = [
  {
    id: "REV001",
    customerId: "CUST001",
    customerName: "John Smith",
    professionalId: "PROF001",
    professionalName: "Dr. Maria Rodriguez",
    companyId: "COMP001",
    companyName: "MediCare Plus",
    appointmentId: "APP001",
    rating: 5,
    comment: "Excellent service! Dr. Rodriguez was very professional and attentive to my needs.",
    date: "2023-05-15T10:30:00Z",
    serviceType: "Medical Consultation",
    status: "published",
    response: "Thank you for your kind words! We're glad you had a positive experience.",
    responseDate: "2023-05-16T14:20:00Z",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-16T14:20:00Z",
  },
  {
    id: "REV002",
    customerId: "CUST002",
    customerName: "Emily Johnson",
    professionalId: "PROF002",
    professionalName: "Alex Thompson",
    companyId: "COMP002",
    companyName: "HomeClean Services",
    appointmentId: "APP002",
    rating: 4,
    comment: "Very good cleaning service. The house looks great, but they were 15 minutes late.",
    date: "2023-05-10T15:45:00Z",
    serviceType: "Home Cleaning",
    status: "published",
    response: "Thank you for your feedback. We apologize for the delay and will work to improve our punctuality.",
    responseDate: "2023-05-11T09:10:00Z",
    createdAt: "2023-05-10T15:45:00Z",
    updatedAt: "2023-05-11T09:10:00Z",
  },
  {
    id: "REV003",
    customerId: "CUST003",
    customerName: "Michael Brown",
    professionalId: "PROF003",
    professionalName: "Sarah Wilson",
    companyId: "COMP003",
    companyName: "TechSupport Inc",
    appointmentId: "APP003",
    rating: 2,
    comment: "The technician couldn't solve my computer issue and had to schedule another visit.",
    date: "2023-05-08T13:20:00Z",
    serviceType: "Computer Repair",
    status: "published",
    response:
      "We're sorry to hear about your experience. We've assigned a senior technician for your next appointment.",
    responseDate: "2023-05-08T17:30:00Z",
    createdAt: "2023-05-08T13:20:00Z",
    updatedAt: "2023-05-08T17:30:00Z",
  },
  {
    id: "REV004",
    customerId: "CUST004",
    customerName: "Jessica Davis",
    professionalId: "PROF004",
    professionalName: "Robert Miller",
    companyId: "COMP004",
    companyName: "GreenLawn Gardening",
    appointmentId: "APP004",
    rating: 5,
    comment: "Robert did an amazing job with our garden. Very professional and knowledgeable.",
    date: "2023-05-05T11:00:00Z",
    serviceType: "Garden Maintenance",
    status: "published",
    response: "",
    responseDate: "",
    createdAt: "2023-05-05T11:00:00Z",
    updatedAt: "2023-05-05T11:00:00Z",
  },
  {
    id: "REV005",
    customerId: "CUST005",
    customerName: "David Wilson",
    professionalId: "PROF005",
    professionalName: "Jennifer Lee",
    companyId: "COMP005",
    companyName: "BeautySpot Salon",
    appointmentId: "APP005",
    rating: 3,
    comment: "The haircut was okay, but not exactly what I asked for.",
    date: "2023-05-03T16:30:00Z",
    serviceType: "Haircut",
    status: "pending",
    response: "",
    responseDate: "",
    createdAt: "2023-05-03T16:30:00Z",
    updatedAt: "2023-05-03T16:30:00Z",
  },
]

// Get all reviews
export async function getReviews(): Promise<Review[]> {
  try {
    // For development, return mock data
    // In production, this would be:
    // return await apiRequest<Review[]>('/api/reviews', 'GET')
    return mockReviews
  } catch (error) {
    console.error("Error fetching reviews:", error)
    throw error
  }
}

// Get a specific review by ID
export async function getReviewById(id: string): Promise<Review | null> {
  try {
    // For development, return mock data
    // In production, this would be:
    // return await apiRequest<Review>(`/api/reviews/${id}`, 'GET')
    const review = mockReviews.find((review) => review.id === id)
    return review || null
  } catch (error) {
    console.error(`Error fetching review with ID ${id}:`, error)
    throw error
  }
}

// Create a new review
export async function createReview(reviewData: ReviewFormData): Promise<Review> {
  try {
    // For development, return mock data
    // In production, this would be:
    // return await apiRequest<Review>('/api/reviews', 'POST', reviewData)
    const newReview: Review = {
      id: `REV${String(mockReviews.length + 1).padStart(3, "0")}`,
      ...reviewData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockReviews.push(newReview)
    return newReview
  } catch (error) {
    console.error("Error creating review:", error)
    throw error
  }
}

// Update an existing review
export async function updateReview(id: string, reviewData: Partial<ReviewFormData>): Promise<Review> {
  try {
    // For development, update mock data
    // In production, this would be:
    // return await apiRequest<Review>(`/api/reviews/${id}`, 'PUT', reviewData)
    const reviewIndex = mockReviews.findIndex((review) => review.id === id)
    if (reviewIndex === -1) {
      throw new Error(`Review with ID ${id} not found`)
    }

    const updatedReview = {
      ...mockReviews[reviewIndex],
      ...reviewData,
      updatedAt: new Date().toISOString(),
    }
    mockReviews[reviewIndex] = updatedReview
    return updatedReview
  } catch (error) {
    console.error(`Error updating review with ID ${id}:`, error)
    throw error
  }
}

// Delete a review
export async function deleteReview(id: string): Promise<void> {
  try {
    // For development, delete from mock data
    // In production, this would be:
    // await apiRequest<void>(`/api/reviews/${id}`, 'DELETE')
    const reviewIndex = mockReviews.findIndex((review) => review.id === id)
    if (reviewIndex === -1) {
      throw new Error(`Review with ID ${id} not found`)
    }
    mockReviews.splice(reviewIndex, 1)
  } catch (error) {
    console.error(`Error deleting review with ID ${id}:`, error)
    throw error
  }
}

// Get reviews by company ID
export async function getReviewsByCompany(companyId: string): Promise<Review[]> {
  try {
    // For development, filter mock data
    // In production, this would be:
    // return await apiRequest<Review[]>(`/api/reviews?companyId=${companyId}`, 'GET')
    return mockReviews.filter((review) => review.companyId === companyId)
  } catch (error) {
    console.error(`Error fetching reviews for company ${companyId}:`, error)
    throw error
  }
}

// Get reviews by professional ID
export async function getReviewsByProfessional(professionalId: string): Promise<Review[]> {
  try {
    // For development, filter mock data
    // In production, this would be:
    // return await apiRequest<Review[]>(`/api/reviews?professionalId=${professionalId}`, 'GET')
    return mockReviews.filter((review) => review.professionalId === professionalId)
  } catch (error) {
    console.error(`Error fetching reviews for professional ${professionalId}:`, error)
    throw error
  }
}

// Get reviews by customer ID
export async function getReviewsByCustomer(customerId: string): Promise<Review[]> {
  try {
    // For development, filter mock data
    // In production, this would be:
    // return await apiRequest<Review[]>(`/api/reviews?customerId=${customerId}`, 'GET')
    return mockReviews.filter((review) => review.customerId === customerId)
  } catch (error) {
    console.error(`Error fetching reviews for customer ${customerId}:`, error)
    throw error
  }
}

// Get reviews by status
export async function getReviewsByStatus(status: string): Promise<Review[]> {
  try {
    // For development, filter mock data
    // In production, this would be:
    // return await apiRequest<Review[]>(`/api/reviews?status=${status}`, 'GET')
    return mockReviews.filter((review) => review.status === status)
  } catch (error) {
    console.error(`Error fetching reviews with status ${status}:`, error)
    throw error
  }
}

// Get reviews by rating
export async function getReviewsByRating(rating: number): Promise<Review[]> {
  try {
    // For development, filter mock data
    // In production, this would be:
    // return await apiRequest<Review[]>(`/api/reviews?rating=${rating}`, 'GET')
    return mockReviews.filter((review) => review.rating === rating)
  } catch (error) {
    console.error(`Error fetching reviews with rating ${rating}:`, error)
    throw error
  }
}

// Search reviews
export async function searchReviews(query: string): Promise<Review[]> {
  try {
    // For development, filter mock data
    // In production, this would be:
    // return await apiRequest<Review[]>(`/api/reviews/search?q=${query}`, 'GET')
    const lowerCaseQuery = query.toLowerCase()
    return mockReviews.filter(
      (review) =>
        review.customerName?.toLowerCase().includes(lowerCaseQuery) ||
        review.professionalName?.toLowerCase().includes(lowerCaseQuery) ||
        review.companyName?.toLowerCase().includes(lowerCaseQuery) ||
        review.comment?.toLowerCase().includes(lowerCaseQuery),
    )
  } catch (error) {
    console.error(`Error searching reviews with query ${query}:`, error)
    throw error
  }
}

// Add a response to a review
export async function addReviewResponse(id: string, response: string): Promise<Review> {
  try {
    // For development, update mock data
    // In production, this would be:
    // return await apiRequest<Review>(`/api/reviews/${id}/response`, 'POST', { response })
    const reviewIndex = mockReviews.findIndex((review) => review.id === id)
    if (reviewIndex === -1) {
      throw new Error(`Review with ID ${id} not found`)
    }

    const updatedReview = {
      ...mockReviews[reviewIndex],
      response,
      responseDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockReviews[reviewIndex] = updatedReview
    return updatedReview
  } catch (error) {
    console.error(`Error adding response to review with ID ${id}:`, error)
    throw error
  }
}
