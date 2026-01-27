/**
 * API Response Types
 * Type definitions for authentication API responses
 */

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean
  message: string | null
  data: T
}

// Error response structure
export interface ApiErrorResponse {
  status: 'error'
  message: string
  errors?: any
}

// Auth Types
export interface SigninResponseData {
  user_id: string
  email: string
  name: string
  session_id: string
  access_token: string
  refresh_token: string
  access_token_expiry: number | null
  refresh_token_expiry: number | null
}

export interface SigninResponse extends ApiResponse<SigninResponseData> {}

export interface ForgotPasswordData {
  token?: string
  reset_link?: string
  expires_at?: number
}

export interface ForgotPasswordResponse extends ApiResponse<ForgotPasswordData | null> {}

export interface ValidateTokenData {
  is_token_valid: boolean
}

export interface ValidateTokenResponse extends ApiResponse<ValidateTokenData> {}

export interface ResetPasswordResponse extends ApiResponse<null> {}

export interface ChangePasswordResponse extends ApiResponse<null> {}

export interface ApiError {
  statusCode: number
  statusMessage: string
  data?: {
    message?: string
  }
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

// User Profile Types
export interface UserProfileData {
  user_id: string
  email: string
  name: string
  created_at: number
  updated_at: number
}

export interface UserProfileResponse extends ApiResponse<UserProfileData> {}

export interface UpdateProfileRequest {
  name: string
}

export interface UpdateProfileResponse extends ApiResponse<UserProfileData> {}

// Email Change Types
export interface ChangeEmailRequest {
  new_email: string
  password: string
}

export interface ChangeEmailResponse extends ApiResponse<{ message: string } | null> {}

export interface ConfirmEmailRequest {
  token: string
}

export interface ConfirmEmailResponse extends ApiResponse<null> {}

// Sessions Types
export interface SessionData {
  id: string
  ip_address: string
  device_info: string
  last_activity_at: number
  expires_at: number
  created_at: number
  is_current: boolean
}

export interface SessionsResponse extends ApiResponse<{ sessions: SessionData[] }> {}

export interface RevokeSessionRequest {
  session_id: string
}

export interface RevokeSessionResponse extends ApiResponse<null> {}

export interface RevokeAllOtherSessionsResponse extends ApiResponse<null> {}

export interface RevokeAllSessionsResponse extends ApiResponse<null> {}
