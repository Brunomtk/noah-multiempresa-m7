"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback, useEffect } from "react"
import { toast } from "sonner"
import type { Customer, CustomerFilters } from "@/types/customer"

// Mock API functions - replace with actual API calls
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    document: "123.456.789-00",
    phone: "(11) 99999-9999",
    address: "Rua das Flores, 123",
    status: 1,
    companyId: "1",
    company: {
      id: "1",
      name: "Empresa ABC",
      document: "12.345.678/0001-90",
      email: "contato@empresaabc.com",
      phone: "(11) 3333-3333",
      address: "Av. Principal, 456",
      status: 1,
      planId: "1",
      createdDate: "2024-01-01T00:00:00Z",
      updatedDate: "2024-01-01T00:00:00Z",
    },
    createdDate: "2024-01-01T00:00:00Z",
    updatedDate: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@email.com",
    document: "987.654.321-00",
    phone: "(11) 88888-8888",
    address: "Rua das Palmeiras, 789",
    status: 1,
    companyId: "2",
    company: {
      id: "2",
      name: "Empresa XYZ",
      document: "98.765.432/0001-10",
      email: "contato@empresaxyz.com",
      phone: "(11) 4444-4444",
      address: "Rua Secundária, 321",
      status: 1,
      planId: "2",
      createdDate: "2024-01-01T00:00:00Z",
      updatedDate: "2024-01-01T00:00:00Z",
    },
    createdDate: "2024-01-01T00:00:00Z",
    updatedDate: "2024-01-01T00:00:00Z",
  },
]

interface CustomersState {
  customers: Customer[]
  loading: boolean
  error: string | null
  filters: CustomerFilters
  selectedCustomer: Customer | null
}

type CustomersAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CUSTOMERS"; payload: Customer[] }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_FILTERS"; payload: CustomerFilters }
  | { type: "SET_SELECTED_CUSTOMER"; payload: Customer | null }
  | { type: "ADD_CUSTOMER"; payload: Customer }
  | { type: "UPDATE_CUSTOMER"; payload: Customer }
  | { type: "DELETE_CUSTOMER"; payload: string }

interface CustomersContextType {
  state: CustomersState
  fetchCustomers: () => Promise<void>
  createCustomer: (data: Omit<Customer, "id" | "createdDate" | "updatedDate">) => Promise<void>
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>
  deleteCustomer: (id: string) => Promise<void>
  setFilters: (filters: Partial<CustomerFilters>) => void
  setSelectedCustomer: (customer: Customer | null) => void
}

const CustomersContext = createContext<CustomersContextType | null>(null)

const initialState: CustomersState = {
  customers: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    status: "all",
    companyId: "",
  },
  selectedCustomer: null,
}

function customersReducer(state: CustomersState, action: CustomersAction): CustomersState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_CUSTOMERS":
      return { ...state, customers: action.payload, loading: false, error: null }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case "SET_SELECTED_CUSTOMER":
      return { ...state, selectedCustomer: action.payload }
    case "ADD_CUSTOMER":
      return { ...state, customers: [action.payload, ...state.customers] }
    case "UPDATE_CUSTOMER":
      return {
        ...state,
        customers: state.customers.map((customer) => (customer.id === action.payload.id ? action.payload : customer)),
      }
    case "DELETE_CUSTOMER":
      return {
        ...state,
        customers: state.customers.filter((customer) => customer.id !== action.payload),
      }
    default:
      return state
  }
}

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(customersReducer, initialState)

  const fetchCustomers = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let filteredCustomers = [...mockCustomers]

      // Apply filters
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filteredCustomers = filteredCustomers.filter(
          (customer) =>
            customer.name.toLowerCase().includes(searchLower) ||
            customer.email.toLowerCase().includes(searchLower) ||
            customer.document.includes(searchLower),
        )
      }

      if (state.filters.status !== "all") {
        filteredCustomers = filteredCustomers.filter((customer) => customer.status.toString() === state.filters.status)
      }

      if (state.filters.companyId) {
        filteredCustomers = filteredCustomers.filter((customer) => customer.companyId === state.filters.companyId)
      }

      dispatch({ type: "SET_CUSTOMERS", payload: filteredCustomers })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch customers"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
    }
  }, [state.filters])

  const createCustomerAction = useCallback(async (data: Omit<Customer, "id" | "createdDate" | "updatedDate">) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newCustomer: Customer = {
        ...data,
        id: Date.now().toString(),
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      }

      dispatch({ type: "ADD_CUSTOMER", payload: newCustomer })
      toast.success("Customer created successfully")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create customer"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const updateCustomerAction = useCallback(
    async (id: string, data: Partial<Customer>) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const existingCustomer = state.customers.find((c) => c.id === id)
        if (!existingCustomer) {
          throw new Error("Customer not found")
        }

        const updatedCustomer: Customer = {
          ...existingCustomer,
          ...data,
          updatedDate: new Date().toISOString(),
        }

        dispatch({ type: "UPDATE_CUSTOMER", payload: updatedCustomer })
        toast.success("Customer updated successfully")
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update customer"
        dispatch({ type: "SET_ERROR", payload: message })
        toast.error(message)
        throw error
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.customers],
  )

  const deleteCustomerAction = useCallback(async (id: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      dispatch({ type: "DELETE_CUSTOMER", payload: id })
      toast.success("Customer deleted successfully")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete customer"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const setFilters = useCallback((filters: Partial<CustomerFilters>) => {
    dispatch({ type: "SET_FILTERS", payload: filters })
  }, [])

  const setSelectedCustomer = useCallback((customer: Customer | null) => {
    dispatch({ type: "SET_SELECTED_CUSTOMER", payload: customer })
  }, [])

  // Fetch customers when filters change
  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const value: CustomersContextType = {
    state,
    fetchCustomers,
    createCustomer: createCustomerAction,
    updateCustomer: updateCustomerAction,
    deleteCustomer: deleteCustomerAction,
    setFilters,
    setSelectedCustomer,
  }

  return <CustomersContext.Provider value={value}>{children}</CustomersContext.Provider>
}

export function useCustomers() {
  const context = useContext(CustomersContext)
  if (!context) {
    throw new Error("useCustomers must be used within a CustomersProvider")
  }
  return context
}
