"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByCompany,
  getReviewsByProfessional,
  getReviewsByCustomer,
  getReviewsByStatus,
  getReviewsByRating,
  searchReviews,
  addReviewResponse,
} from "@/lib/api/reviews"
import type { Review, ReviewFormData, ReviewFilters } from "@/types/review"

interface ReviewsContextType {
  reviews: Review[]
  isLoading: boolean
  error: string | null
  filters: ReviewFilters
  fetchReviews: () => Promise<void>
  fetchReviewById: (id: string) => Promise<Review | null>
  addReview: (reviewData: ReviewFormData) => Promise<Review>
  editReview: (id: string, reviewData: Partial<ReviewFormData>) => Promise<Review>
  removeReview: (id: string) => Promise<void>
  fetchReviewsByCompany: (companyId: string) => Promise<void>
  fetchReviewsByProfessional: (professionalId: string) => Promise<void>
  fetchReviewsByCustomer: (customerId: string) => Promise<void>
  fetchReviewsByStatus: (status: string) => Promise<void>
  fetchReviewsByRating: (rating: number) => Promise<void>
  searchReviewsQuery: (query: string) => Promise<void>
  respondToReview: (id: string, response: string) => Promise<Review>
  setFilters: (newFilters: Partial<ReviewFilters>) => void
  resetFilters: () => void
  filteredReviews: Review[]
}

const defaultFilters: ReviewFilters = {
  status: "all",
  rating: "all",
  searchQuery: "",
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined)

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ReviewFilters>(defaultFilters)
  const { toast } = useToast()

  const fetchReviews = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getReviews()
      setReviews(data)
    } catch (err) {
      setError("Failed to fetch reviews")
      toast({
        title: "Error",
        description: "Failed to fetch reviews. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReviewById = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const review = await getReviewById(id)
      return review
    } catch (err) {
      setError(`Failed to fetch review with ID ${id}`)
      toast({
        title: "Error",
        description: `Failed to fetch review details. Please try again.`,
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const addReview = async (reviewData: ReviewFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      const newReview = await createReview(reviewData)
      setReviews((prev) => [...prev, newReview])
      toast({
        title: "Success",
        description: "Review added successfully.",
      })
      return newReview
    } catch (err) {
      setError("Failed to add review")
      toast({
        title: "Error",
        description: "Failed to add review. Please try again.",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const editReview = async (id: string, reviewData: Partial<ReviewFormData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedReview = await updateReview(id, reviewData)
      setReviews((prev) => prev.map((review) => (review.id === id ? updatedReview : review)))
      toast({
        title: "Success",
        description: "Review updated successfully.",
      })
      return updatedReview
    } catch (err) {
      setError(`Failed to update review with ID ${id}`)
      toast({
        title: "Error",
        description: "Failed to update review. Please try again.",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const removeReview = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await deleteReview(id)
      setReviews((prev) => prev.filter((review) => review.id !== id))
      toast({
        title: "Success",
        description: "Review deleted successfully.",
      })
    } catch (err) {
      setError(`Failed to delete review with ID ${id}`)
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReviewsByCompany = async (companyId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getReviewsByCompany(companyId)
      setReviews(data)
    } catch (err) {
      setError(`Failed to fetch reviews for company ${companyId}`)
      toast({
        title: "Error",
        description: "Failed to fetch company reviews. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReviewsByProfessional = async (professionalId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getReviewsByProfessional(professionalId)
      setReviews(data)
    } catch (err) {
      setError(`Failed to fetch reviews for professional ${professionalId}`)
      toast({
        title: "Error",
        description: "Failed to fetch professional reviews. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReviewsByCustomer = async (customerId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getReviewsByCustomer(customerId)
      setReviews(data)
    } catch (err) {
      setError(`Failed to fetch reviews for customer ${customerId}`)
      toast({
        title: "Error",
        description: "Failed to fetch customer reviews. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReviewsByStatus = async (status: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getReviewsByStatus(status)
      setReviews(data)
    } catch (err) {
      setError(`Failed to fetch reviews with status ${status}`)
      toast({
        title: "Error",
        description: "Failed to fetch reviews by status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReviewsByRating = async (rating: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getReviewsByRating(rating)
      setReviews(data)
    } catch (err) {
      setError(`Failed to fetch reviews with rating ${rating}`)
      toast({
        title: "Error",
        description: "Failed to fetch reviews by rating. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const searchReviewsQuery = async (query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await searchReviews(query)
      setReviews(data)
    } catch (err) {
      setError(`Failed to search reviews with query ${query}`)
      toast({
        title: "Error",
        description: "Failed to search reviews. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const respondToReview = async (id: string, response: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedReview = await addReviewResponse(id, response)
      setReviews((prev) => prev.map((review) => (review.id === id ? updatedReview : review)))
      toast({
        title: "Success",
        description: "Response added successfully.",
      })
      return updatedReview
    } catch (err) {
      setError(`Failed to add response to review with ID ${id}`)
      toast({
        title: "Error",
        description: "Failed to add response. Please try again.",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateFilters = (newFilters: Partial<ReviewFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  // Apply filters to reviews
  const getFilteredReviews = () => {
    return reviews.filter((review) => {
      // Filter by status
      if (filters.status !== "all" && review.status !== filters.status) {
        return false
      }

      // Filter by rating
      if (filters.rating !== "all" && review.rating !== Number.parseInt(filters.rating)) {
        return false
      }

      // Filter by search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        return (
          review.customerName?.toLowerCase().includes(query) ||
          review.professionalName?.toLowerCase().includes(query) ||
          review.companyName?.toLowerCase().includes(query) ||
          review.comment?.toLowerCase().includes(query)
        )
      }

      return true
    })
  }

  // Load reviews on initial mount
  useEffect(() => {
    fetchReviews()
  }, [])

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        isLoading,
        error,
        filters,
        fetchReviews,
        fetchReviewById,
        addReview,
        editReview,
        removeReview,
        fetchReviewsByCompany,
        fetchReviewsByProfessional,
        fetchReviewsByCustomer,
        fetchReviewsByStatus,
        fetchReviewsByRating,
        searchReviewsQuery,
        respondToReview,
        setFilters: updateFilters,
        resetFilters,
        filteredReviews: getFilteredReviews(),
      }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviewsContext() {
  const context = useContext(ReviewsContext)
  if (context === undefined) {
    throw new Error("useReviewsContext must be used within a ReviewsProvider")
  }
  return context
}
