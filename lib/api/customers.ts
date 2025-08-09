import { fetchApi } from "./utils"
import type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerFilters,
  CustomerResponse,
} from "@/types/customer"

export const customersApi = {
  async getAll(filters?: CustomerFilters): Promise<CustomerResponse> {
    const params = new URLSearchParams()

    if (filters?.companyId) params.append("CompanyId", filters.companyId.toString())
    if (filters?.name) params.append("Name", filters.name)
    if (filters?.document) params.append("Document", filters.document)
    if (filters?.status !== undefined) params.append("Status", filters.status.toString())
    if (filters?.pageNumber) params.append("PageNumber", filters.pageNumber.toString())
    if (filters?.pageSize) params.append("PageSize", filters.pageSize.toString())

    const queryString = params.toString()
    const url = queryString ? `/Customer?${queryString}` : "/Customer"

    const response = await fetchApi(url)

    // The API returns { results: [...], currentPage, pageCount, etc. }
    // We need to transform it to match our expected CustomerResponse structure
    return {
      data: response.results || [],
      meta: {
        currentPage: response.currentPage || 1,
        totalPages: response.pageCount || 1,
        totalItems: response.totalItems || 0,
        itemsPerPage: response.pageSize || 10,
      },
    }
  },

  async getById(id: number): Promise<Customer> {
    return await fetchApi(`/Customer/${id}`)
  },

  async create(data: CreateCustomerRequest): Promise<Customer> {
    return await fetchApi("/Customer", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async update(data: UpdateCustomerRequest): Promise<Customer> {
    return await fetchApi("/Customer", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async delete(id: number): Promise<void> {
    return await fetchApi(`/Customer/${id}`, {
      method: "DELETE",
    })
  },
}
