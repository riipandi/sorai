import { useStore } from '@nanostores/react'
import { useCallback, useEffect, useState } from 'react'
import type { User, WhoamiData } from '#/schemas/user.schema'
import { authStore } from '#/stores'
import { fetcher, resetSessionExpiredFlag } from '#/utils/fetcher'
import { toast } from '../components/toast'
import { AuthContext, type AuthContextType } from './context'
import { signout } from './procedures'

/**
 * AuthProvider component that provides authentication state and methods
 * to all child components using the existing authStore for persistence.
 * User information is fetched from /auth/whoami endpoint.
 */
export function AuthProvider({ children }: React.PropsWithChildren) {
  // Get current auth state from store reactively
  const authState = useStore(authStore)

  // Check if user is authenticated based on access token
  const isAuthenticated = !!authState?.atoken

  // Store user data fetched from /auth/whoami endpoint
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Fetch user information from /auth/whoami endpoint
   */
  const fetchUser = useCallback(async (): Promise<User | null> => {
    try {
      const response = await fetcher<{
        status: 'success' | 'error'
        message: string
        data: WhoamiData | null
        error: any
      }>('/auth/whoami')

      if (response.status === 'success' && response.data) {
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
  }, [])

  // Fetch user data when authenticated
  useEffect(() => {
    let mounted = true

    if (isAuthenticated) {
      setIsLoading(true)
      fetchUser()
        .then((userData) => {
          if (mounted) {
            setUser(userData)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          if (mounted) {
            console.error('Failed to fetch user info:', error)
            setUser(null)
            setIsLoading(false)
          }
        })
    } else {
      if (mounted) {
        setUser(null)
      }
    }

    return () => {
      mounted = false
    }
  }, [isAuthenticated, fetchUser])

  /**
   * Login function with API authentication
   * @param email - User email
   * @param password - User password
   * @param remember - Whether to remember the user
   * @returns Promise with success status and optional error message
   */
  const login = async (
    email: string,
    password: string,
    remember: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Call the signin API endpoint
      const response = await fetcher<{
        status: 'success' | 'error'
        message: string
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
        error: any
      }>('/auth/signin', {
        method: 'POST',
        body: { email, password }
      })

      if (response.status !== 'success' || !response.data) {
        toast.add({
          title: 'Login Failed',
          description: response.message || 'Invalid email or password',
          type: 'error',
          timeout: 7000
        })
        return { success: false, error: response.message || 'Invalid email or password' }
      }

      // Update auth store with session ID and tokens from backend (user info will be fetched from whoami)
      authStore.set({
        atoken: response.data.access_token,
        atokenexp: response.data.access_token_expiry,
        rtoken: response.data.refresh_token,
        rtokenexp: response.data.refresh_token_expiry,
        sessid: response.data.session_id,
        remember
      })

      resetSessionExpiredFlag()

      toast.add({
        title: 'Welcome back!',
        description: 'You have successfully signed in',
        type: 'success',
        timeout: 5000
      })

      return { success: true }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Login failed'
      toast.add({
        title: 'Login Failed',
        description: errorMessage,
        type: 'error',
        timeout: 7000
      })
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Logout function that clears authentication state and calls logout API
   */
  const logout = async (): Promise<void> => {
    await signout() // Call logout API to revoke refresh token and deactivate session
    setUser(null) // Clear user state
  }

  /**
   * Refetch user data from /auth/whoami endpoint
   * Useful after updating user profile
   */
  const refetchUser = async (): Promise<void> => {
    const userData = await fetchUser()
    setUser(userData)
  }

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refetchUser
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
