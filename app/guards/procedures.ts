import { redirect, type ParsedLocation } from '@tanstack/react-router'
import { decodeJwt } from 'jose'
import { ofetch } from 'ofetch'
import type { JWTClaims } from '#/schemas/auth.schema'
import { authStore } from '#/stores'

/**
 * Extract session ID from access token using jose library
 *
 * @param token - The access token
 * @returns The session ID or null if not found
 */
export function extractSessionIdFromToken(token: string): string | null {
  try {
    const payload = decodeJwt<JWTClaims>(token)
    return payload?.sid || null
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

/**
 * Check if access token is expired or will expire soon
 *
 * @param expiry - Token expiry timestamp (Unix timestamp in seconds)
 * @param bufferSeconds - Buffer time in seconds before expiry (default: 60 seconds)
 * @returns True if token is expired or will expire soon
 */
export function isTokenExpired(expiry: number | null, bufferSeconds: number = 60): boolean {
  if (!expiry) return true
  const now = Math.floor(Date.now() / 1000)
  return expiry <= now + bufferSeconds
}

/**
 * Check if refresh token is actually expired (no buffer)
 *
 * @param expiry - Token expiry timestamp (Unix timestamp in seconds)
 * @returns True if token is expired
 */
export function isRefreshTokenExpired(expiry: number | null): boolean {
  if (!expiry) return true
  const now = Math.floor(Date.now() / 1000)
  return expiry <= now
}

/**
 * Refresh access token using refresh token from auth store
 *
 * @returns New tokens or null if refresh failed
 */
export async function refreshAccessToken(): Promise<{
  access_token: string
  refresh_token: string
  access_token_expiry: number
  refresh_token_expiry: number
  sessid: string
} | null> {
  const authState = authStore.get()
  if (!authState?.rtoken || !authState?.sessid) {
    return null
  }

  try {
    const response = await ofetch<{
      status: 'success' | 'error'
      message: string
      data: {
        access_token: string
        refresh_token: string
        access_token_expiry: number
        refresh_token_expiry: number
        sessid: string
      }
      error: any
    }>('/api/auth/refresh', {
      method: 'POST',
      body: {
        refresh_token: authState.rtoken,
        session_id: authState.sessid
      }
    })

    if (response.status === 'success' && response.data) {
      const currentAuth = authStore.get()
      authStore.set({
        atoken: response.data.access_token,
        atokenexp: response.data.access_token_expiry,
        rtoken: response.data.refresh_token,
        rtokenexp: response.data.refresh_token_expiry,
        sessid: response.data.sessid,
        remember: currentAuth.remember
      })

      return response.data
    }

    return null
  } catch (error) {
    console.error('Failed to refresh token:', error)
    return null
  }
}

/**
 * Logout function to clear auth state and call logout endpoint
 *
 * @returns Promise that resolves when logout is complete
 */
export async function signout(): Promise<void> {
  const authState = authStore.get()

  if (authState?.rtoken) {
    const sessionId = authState.sessid || ''
    try {
      await ofetch('/api/auth/logout', {
        method: 'POST',
        body: {
          refresh_token: authState.rtoken,
          session_id: sessionId
        }
      })
    } catch (error) {
      console.error('Logout API call failed:', error)
    }
  }

  authStore.set({
    atoken: null,
    atokenexp: null,
    rtoken: null,
    rtokenexp: null,
    sessid: null,
    remember: false
  })
}

// Middleware for TanStack Router
export function requireAuthentication(location: ParsedLocation) {
  const authState = authStore.get()
  const isAuthenticated = !!authState?.atoken

  if (!isAuthenticated) {
    throw redirect({
      to: '/signin',
      search: {
        redirect: location.pathname
      }
    })
  }
}
