import type { User } from "./user"

export interface AuthUser extends User {
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}
