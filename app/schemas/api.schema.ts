export interface ApiResponse<T = unknown, E = unknown> {
  status: 'success' | 'error'
  message: string
  data: T | null
  error: E | null
}
