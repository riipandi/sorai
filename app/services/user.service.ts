import type { WhoamiResponse } from '#/schemas/user.schema'
import fetcher from '../fetcher'

export async function whoami() {
  return await fetcher<WhoamiResponse>('/auth/whoami', {
    method: 'GET'
  })
}
