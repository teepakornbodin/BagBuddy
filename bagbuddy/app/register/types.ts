export interface RegisterFormData {
  name: string
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  user?: {
    id: string
    name: string
    email: string
    username: string
  }
}

export interface ValidationError {
  field: keyof RegisterFormData
  message: string
}