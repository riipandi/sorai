import { ofetch, type $Fetch, type FetchOptions } from 'ofetch'
import { toast } from '#/components/toast'
import { isTokenExpired, isRefreshTokenExpired, refreshAccessToken } from '#/guards'
import { authStore } from '#/stores'

type RefreshResult = {
  access_token: string
  refresh_token: string
  access_token_expiry: number
  refresh_token_expiry: number
  sessid: string
} | null

let isRefreshing = false
let refreshPromise: Promise<RefreshResult> | null = null
let hasShownSessionExpiredToast = false

/**
 * HTTP client with automatic Bearer token authentication and token refresh.
 *
 * @param baseUrl - Base URL for all requests (e.g., '/api' or 'https://api.example.com')
 * @param options - Additional ofetch configuration options
 * @returns Configured ofetch instance with auth interceptor
 *
 * @remarks
 * Token refresh flow:
 * 1. Check if access token is expired before request
 * 2. If expired, wait for in-progress refresh or start new one
 * 3. Use refreshed token for the request
 * 4. On 401 error, clear auth state
 *
 * @example
 * ```tsx
 * const api = createFetcher('https://api.example.com')
 * const users = await api('/users')
 * const newUser = await api('/users', {
 *   method: 'POST',
 *   body: { name: 'John', email: 'john@example.com' }
 * })
 * ```
 */
function createFetcher(baseUrl: string, options: FetchOptions = {}): $Fetch {
  return ofetch.create({
    baseURL: baseUrl,
    ...options,
    /**
     * Request interceptor - adds Bearer token and handles refresh.
     */
    async onRequest({ options }) {
      const authState = authStore.get()

      if (authState?.atoken && authState?.rtoken) {
        if (isTokenExpired(authState.atokenexp)) {
          if (isRefreshTokenExpired(authState.rtokenexp)) {
            if (!hasShownSessionExpiredToast) {
              hasShownSessionExpiredToast = true
              toast.add({
                title: 'Session Expired',
                description: 'Your session has expired. Please sign in again.',
                type: 'warning',
                timeout: 6000
              })
            }
            authStore.set({
              atoken: null,
              atokenexp: null,
              rtoken: null,
              rtokenexp: null,
              sessid: null,
              remember: false
            })

            const currentPath = window.location.pathname
            if (currentPath !== '/signin') {
              setTimeout(() => {
                hasShownSessionExpiredToast = false
              }, 1000)
              window.location.href = `/signin?redirect=${encodeURIComponent(currentPath)}`
            }

            throw new Error('Refresh token expired')
          }

          try {
            if (isRefreshing && refreshPromise) {
              await refreshPromise
            } else {
              isRefreshing = true
              refreshPromise = refreshAccessToken()
              await refreshPromise
              isRefreshing = false
              refreshPromise = null
            }

            const updatedAuthState = authStore.get()
            if (updatedAuthState?.atoken) {
              options.headers = new Headers(options.headers)
              options.headers.set('Authorization', `Bearer ${updatedAuthState.atoken}`)
            } else {
              throw new Error('Token refresh failed - no token available')
            }
          } catch (error) {
            isRefreshing = false
            refreshPromise = null
            if (!hasShownSessionExpiredToast) {
              hasShownSessionExpiredToast = true
              toast.add({
                title: 'Session Expired',
                description: 'Your session has expired. Please sign in again.',
                type: 'warning',
                timeout: 6000
              })
            }
            authStore.set({
              atoken: null,
              atokenexp: null,
              rtoken: null,
              rtokenexp: null,
              sessid: null,
              remember: false
            })

            const currentPath = window.location.pathname
            if (currentPath !== '/signin') {
              setTimeout(() => {
                hasShownSessionExpiredToast = false
              }, 1000)
              window.location.href = `/signin?redirect=${encodeURIComponent(currentPath)}`
            }

            throw error
          }
        } else {
          options.headers = new Headers(options.headers)
          options.headers.set('Authorization', `Bearer ${authState.atoken}`)
        }
      }
    },
    /**
     * Response error interceptor - clears auth state on 401.
     */
    onResponseError({ response }) {
      if (response.status === 401) {
        if (!hasShownSessionExpiredToast) {
          hasShownSessionExpiredToast = true
          toast.add({
            title: 'Authentication Required',
            description: 'Your session has expired. Please sign in again.',
            type: 'warning',
            timeout: 6000
          })
        }

        authStore.set({
          atoken: null,
          atokenexp: null,
          rtoken: null,
          rtokenexp: null,
          sessid: null,
          remember: false
        })

        const currentPath = window.location.pathname
        if (currentPath !== '/signin') {
          setTimeout(() => {
            hasShownSessionExpiredToast = false
          }, 1000)
          window.location.href = `/signin?redirect=${encodeURIComponent(currentPath)}`
        }
      }
    }
  })
}

/**
 * Default fetcher instance for API requests (base URL: `/api`).
 *
 * Automatically handles Bearer token injection, token refresh, and 401 errors.
 *
 * @example
 * ```tsx
 * import { fetcher } from '#/utils/fetcher'
 *
 * // GET request
 * const users = await fetcher('/users')
 *
 * // POST request
 * const newUser = await fetcher('/users', {
 *   method: 'POST',
 *   body: { name: 'John' }
 * })
 *
 * // With TypeScript generics
 * interface User { id: string; name: string }
 * const user = await fetcher<User>('/users/1')
 * ```
 */
const fetcher = createFetcher('/api')

export function resetSessionExpiredFlag() {
  hasShownSessionExpiredToast = false
}

export { createFetcher, fetcher }
