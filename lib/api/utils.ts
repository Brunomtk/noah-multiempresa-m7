// Simulação de delay para simular chamadas de API
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Exportar apiDelay como alias para delay (para compatibilidade)
export const apiDelay = delay

// Base URL da API (será substituída pela URL real quando disponível)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.noah-platform.com"

// Função auxiliar para simular erros aleatórios (para testes)
export const simulateRandomError = (probability = 0.1): boolean => {
  return Math.random() < probability
}

// Função para obter o header de autenticação
export const getAuthHeader = (): Record<string, string> => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("noah_token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
  return {}
}

// Função genérica para fazer requisições à API
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    // Quando tivermos a API real, usaremos:
    // const response = await fetch(`${API_URL}${endpoint}`, {
    //   ...options,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     ...getAuthHeader(),
    //     ...options.headers,
    //   },
    // });
    // if (!response.ok) {
    //   throw new Error(`API request failed with status ${response.status}`);
    // }
    // return await response.json();

    // Por enquanto, retornamos dados simulados
    return {} as T
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}
