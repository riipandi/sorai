import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Heading, Text } from '#/components/typography'
import { useAuth } from '#/guards'
import { healthCheck } from '#/services/system.service'

const healthCheckQuery = queryOptions({
  queryKey: ['healthCheck'],
  queryFn: healthCheck
})

export const Route = createFileRoute('/(app)/')({
  component: RouteComponent,
  loader: ({ context }) => {
    // Ensure the data is in the cache before render
    context.queryClient.ensureQueryData(healthCheckQuery)
  }
})

function RouteComponent() {
  const { user } = useAuth()
  const { data } = useSuspenseQuery(healthCheckQuery)

  return (
    <div className='mx-auto max-w-7xl space-y-6 p-2 lg:px-6 lg:py-2'>
      {/* Page Header */}
      <div className='min-w-0 flex-1 space-y-1.5'>
        <Heading level={1} size='md'>
          Dashboard
        </Heading>
        <Text className='text-muted'>
          Welcome back, {user?.name || 'User'}! Here's an overview of your application.
        </Text>
      </div>

      {/* Page Content */}
      <div className='min-w-0 flex-1'>
        <Text>{data.message ? data.message : 'This is page content'}</Text>
      </div>
    </div>
  )
}
