export const API_BASE_URL = "/api"

// This will make all API calls go through the same domain, eliminating CORS issues
export const fetchApi = async (endpoint: string, options?: RequestInit): Promise<any> => {
  const url = `${API_BASE_URL}/${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`)
  }

  return response.json()
}
