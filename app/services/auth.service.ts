import { fetcher } from '#/utils/fetcher'

interface ApiSuccessResponse<T> {
  status: 'success'
  message: string
  data: T
}

interface ApiErrorResponse {
  status: 'error'
  message: string
  error: any
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

interface SigninData {
  user_id: string
  email: string
  name: string
  session_id: string
  access_token: string
  refresh_token: string
  access_token_expiry: number
  refresh_token_expiry: number
}

interface RefreshData {
  session_id: string
  access_token: string
  refresh_token: string
  access_token_expiry: number
  refresh_token_expiry: number
}

interface UserData {
  user_id: string
  email: string
  name: string
}

interface SessionData {
  id: string
  ip_address: string
  device_info: string
  last_activity_at: number
  expires_at: number
  created_at: number
}

interface SessionsData {
  sessions: SessionData[]
}

export async function signin(email: string, password: string) {
  return await fetcher<ApiResponse<SigninData>>('/auth/signin', {
    method: 'POST',
    body: { email, password }
  })
}

export async function logout(refreshToken: string, sessionId: string) {
  return await fetcher<ApiResponse<null>>('/auth/logout', {
    method: 'POST',
    body: { refresh_token: refreshToken, session_id: sessionId }
  })
}

export async function refresh(refreshToken: string, sessionId: string) {
  return await fetcher<ApiResponse<RefreshData>>('/auth/refresh', {
    method: 'POST',
    body: { refresh_token: refreshToken, session_id: sessionId }
  })
}

export async function validateToken(token: string) {
  return await fetcher<ApiResponse<{ is_token_valid: boolean }>>('/auth/validate-token', {
    method: 'GET',
    query: { token }
  })
}

export async function whoami() {
  return await fetcher<ApiResponse<UserData>>('/auth/whoami', {
    method: 'GET'
  })
}

export async function passwordChange(currentPassword: string, newPassword: string) {
  return await fetcher<ApiResponse<null>>('/auth/password/change', {
    method: 'POST',
    body: { current_password: currentPassword, new_password: newPassword }
  })
}

export async function passwordForgot(email: string) {
  return await fetcher<ApiResponse<null>>('/auth/password/forgot', {
    method: 'POST',
    body: { email }
  })
}

export async function passwordReset(token: string, password: string) {
  return await fetcher<ApiResponse<null>>('/auth/password/reset', {
    method: 'POST',
    body: { token, password }
  })
}

export async function getUserSessions() {
  try {
    const response = await fetcher<ApiResponse<SessionsData>>('/auth/sessions', {
      method: 'GET'
    })
    return response.status === 'success' ? response.data.sessions : []
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
    return []
  }
}

export async function revokeAllSessions() {
  try {
    const response = await fetcher<ApiResponse<null>>('/auth/sessions/all', {
      method: 'DELETE'
    })
    return response.status === 'success'
  } catch (error) {
    console.error('Failed to revoke all sessions:', error)
    return false
  }
}

export async function revokeSession(sessionId: string) {
  try {
    const response = await fetcher<ApiResponse<null>>(`/auth/sessions?session_id=${sessionId}`, {
      method: 'DELETE'
    })
    return response.status === 'success'
  } catch (error) {
    console.error('Failed to revoke session:', error)
    return false
  }
}

export async function revokeOtherSessions() {
  try {
    const response = await fetcher<ApiResponse<null>>('/auth/sessions/others', {
      method: 'DELETE'
    })
    return response.status === 'success'
  } catch (error) {
    console.error('Failed to revoke other sessions:', error)
    return false
  }
}
