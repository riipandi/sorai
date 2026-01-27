export interface User {
  id: string
  email: string
  name: string
}

export interface WhoamiResponse {
  success: boolean
  message: string | null
  data: User | null
}
