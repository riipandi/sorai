import type { HealthCheckResponse } from '#/schemas/system.schema'
import { fetcher } from '#/utils/fetcher'

export async function healthCheck() {
  return await fetcher<HealthCheckResponse>('/healthz', {
    method: 'GET'
  })
}
