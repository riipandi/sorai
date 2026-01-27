import { createContext, useContext } from 'react'
import type { User } from '#/schemas/user.schema'

// Auth context interface
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

// Create auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Custom hook to use the AuthContext
 * @throws Error if used outside of AuthProvider
 */
function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

/**
 * Custom hook to access authentication state and methods.
 * Provides reactive access to auth state using nanostores.
 *
 * @returns AuthContextType object containing user, isAuthenticated, isLoading, login, and logout
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth()
 *
 *   if (isAuthenticated) {
 *     return <div>Welcome, {user?.name}! <button onClick={logout}>Logout</button></div>
 *   }
 *
 *   return <button onClick={() => login('user@example.com', 'password')}>Login</button>
 * }
 * ```
 */
export function useAuth() {
  // Get auth context (includes user, isAuthenticated, isLoading, login, logout)
  return useAuthContext()
}
