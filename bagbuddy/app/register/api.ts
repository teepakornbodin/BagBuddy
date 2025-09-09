import { RegisterFormData, RegisterResponse } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export const registerUser = async (data: RegisterFormData): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name.trim(),
        username: data.username.toLowerCase().trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone.replace(/[-\s]/g, ''),
        password: data.password,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก')
    }

    return result
  } catch (error) {
    console.error('Registration error:', error)
    throw error instanceof Error 
      ? error 
      : new Error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
  }
}

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-username`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username.toLowerCase().trim() }),
    })

    const result = await response.json()
    return result.available
  } catch (error) {
    console.error('Username check error:', error)
    return false
  }
}

export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    })

    const result = await response.json()
    return result.available
  } catch (error) {
    console.error('Email check error:', error)
    return false
  }
}