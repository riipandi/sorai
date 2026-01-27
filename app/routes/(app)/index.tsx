import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '#/guards'
import { healthCheck } from '#/services/system.service'

export const Route = createFileRoute('/(app)/')({
  component: RouteComponent,
  loader: ({ context }) => {
    // Ensure the data is in the cache before render
    context.queryClient.ensureQueryData(healthCheckQuery)
  }
})

const healthCheckQuery = queryOptions({
  queryKey: ['healthCheck'],
  queryFn: healthCheck
})

function RouteComponent() {
  const { user } = useAuth()
  const { data } = useSuspenseQuery(healthCheckQuery)

  return (
    <div className='mx-auto max-w-7xl space-y-6'>
      {/* Page Header */}
      <div className='min-w-0 flex-1'>
        <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>Dashboard</h1>
        <p className='text-normal mt-2 text-gray-500'>Welcome back, {user?.name || 'user'}!</p>
      </div>

      {/* Page Content */}
      <div className='min-w-0 flex-1'>
        <p>{data.message ? data.message : 'This is page content'}</p>
      </div>
    </div>
  )
}
