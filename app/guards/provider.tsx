import { useEffect, useState } from 'react'
import { fetcher, logout as logoutApi } from '#/fetcher'
import type { User } from '#/schemas/user.schema'
import { authStore } from '#/stores'
import { AuthContext, type AuthContextType } from './context'

/**
 * AuthProvider component that provides authentication state and methods
 * to all child components using the existing authStore for persistence.
 * User information is fetched from /auth/whoami endpoint.
 */
export function AuthProvider({ children }: React.PropsWithChildren) {
  // Get current auth state from store
  const authState = authStore.get()

  // Check if user is authenticated based on access token
  const isAuthenticated = !!authState?.atoken

  // Store user data fetched from /auth/whoami endpoint
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Fetch user information from /auth/whoami endpoint
   */
  const fetchUser = async (): Promise<User | null> => {
    try {
      const response = await fetcher<{
        success: boolean
        message: string | null
        data: {
          user_id: string
          email: string
          name: string
        } | null
      }>('/auth/whoami')

      if (response.success && response.data) {
        return {
          id: response.data.user_id,
          email: response.data.email,
          name: response.data.name
        }
      }
      return null
    } catch (error) {
      console.error('Failed to fetch user info:', error)
      return null
    }
  }

  // Fetch user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true)
      fetchUser().then((userData) => {
        setUser(userData)
        setIsLoading(false)
      })
    } else {
      setUser(null)
    }
  }, [isAuthenticated])

  /**
   * Login function with API authentication
   * @param email - User email
   * @param password - User password
   * @returns Promise with success status and optional error message
   */
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Call the signin API endpoint
      const response = await fetcher<{
        success: boolean
        message: string | null
        data: {
          user_id: string
          email: string
          name: string
          session_id: string
          access_token: string
          refresh_token: string
          access_token_expiry: number | null
          refresh_token_expiry: number | null
        }
      }>('/auth/signin', {
        method: 'POST',
        body: { email, password }
      })

      if (!response.success || !response.data) {
        return { success: false, error: response.message || 'Invalid email or password' }
      }

      // Update auth store with session ID and tokens from backend (user info will be fetched from whoami)
      authStore.setKey('atoken', response.data.access_token)
      authStore.setKey('atokenexp', response.data.access_token_expiry)
      authStore.setKey('rtoken', response.data.refresh_token)
      authStore.setKey('rtokenexp', response.data.refresh_token_expiry)

      return { success: true }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Login failed'
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Logout function that clears authentication state and calls logout API
   */
  const logout = async (): Promise<void> => {
    await logoutApi() // Call logout API to revoke refresh token and deactivate session
    setUser(null) // Clear user state
  }

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
