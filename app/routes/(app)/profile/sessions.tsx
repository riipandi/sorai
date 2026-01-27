import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { decodeJwt } from 'jose'
import * as Lucide from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '#/components/selia/alert'
import { Badge } from '#/components/selia/badge'
import { Button } from '#/components/selia/button'
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '#/components/selia/card'
import {
  Item,
  ItemAction,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '#/components/selia/item'
import { Spinner } from '#/components/selia/spinner'
import { Stack } from '#/components/selia/stack'
import { Text } from '#/components/selia/text'
import fetcher from '#/fetcher'
import { authStore } from '#/stores'

export const Route = createFileRoute('/(app)/profile/sessions')({
  component: RouteComponent
})

function RouteComponent() {
  const queryClient = useQueryClient()

  // Get current session ID from access token
  const currentSessionId = (() => {
    try {
      const token = authStore.get().atoken
      if (!token) return null
      const payload = decodeJwt<{ sid?: string }>(token)
      return payload?.sid || null
    } catch {
      return null
    }
  })()

  // Fetch user sessions
  const {
    data: sessionsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['user-sessions'],
    queryFn: () =>
      fetcher<{
        success: boolean
        data: {
          sessions: Array<{
            session_id: string
            ip_address: string
            device_info: string
            last_activity_at: number
            expires_at: number
            created_at: number
          }>
        }
      }>('/auth/sessions')
  })

  // Revoke session mutation
  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return fetcher('/auth/sessions', {
        method: 'DELETE',
        body: { session_id: sessionId }
      })
    },
    onSuccess: () => {
      // Invalidate sessions query to refresh data
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] })
    }
  })

  // Revoke all other sessions mutation
  const revokeAllOtherSessionsMutation = useMutation({
    mutationFn: async () => {
      return fetcher('/auth/sessions/others', {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      // Invalidate sessions query to refresh data
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] })
    }
  })

  // Revoke all sessions mutation
  const revokeAllSessionsMutation = useMutation({
    mutationFn: async () => {
      return fetcher('/auth/sessions/all', {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      // Invalidate sessions query to refresh data
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] })
    }
  })

  const handleRevokeSession = async (sessionId: string) => {
    if (confirm('Are you sure you want to revoke this session?')) {
      await revokeSessionMutation.mutateAsync(sessionId)
    }
  }

  const handleRevokeAllOtherSessions = async () => {
    if (
      confirm(
        'Are you sure you want to revoke all other sessions? You will be logged out from all other devices.'
      )
    ) {
      await revokeAllOtherSessionsMutation.mutateAsync()
    }
  }

  const handleRevokeAllSessions = async () => {
    if (
      confirm(
        'Are you sure you want to revoke all sessions? You will be logged out from all devices including this one.'
      )
    ) {
      await revokeAllSessionsMutation.mutateAsync()
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatRelativeTime = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000)
    const diff = now - timestamp

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return `${Math.floor(diff / 86400)} days ago`
  }

  if (isLoading) {
    return (
      <div className='flex min-h-100 items-center justify-center'>
        <div className='flex items-center gap-2 text-gray-500'>
          <Spinner className='size-5' strokeWidth={2.0} />
          <span>Loading sessions...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <Alert variant='danger'>Failed to load sessions. Please try again later.</Alert>
      </div>
    )
  }

  const sessions = sessionsData?.data?.sessions || []

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>Manage your active sessions across devices</CardDescription>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='secondary'
              size='sm'
              onClick={handleRevokeAllOtherSessions}
              disabled={revokeAllOtherSessionsMutation.isPending || sessions.length <= 1}
            >
              {revokeAllOtherSessionsMutation.isPending ? (
                <span className='flex items-center gap-2'>
                  <Spinner className='size-4' strokeWidth={2.0} />
                  Revoking...
                </span>
              ) : (
                'Revoke Others'
              )}
            </Button>
            <Button
              variant='danger'
              size='sm'
              onClick={handleRevokeAllSessions}
              disabled={revokeAllSessionsMutation.isPending || sessions.length === 0}
            >
              {revokeAllSessionsMutation.isPending ? (
                <span className='flex items-center gap-2'>
                  <Spinner className='size-4' strokeWidth={2.0} />
                  Revoking...
                </span>
              ) : (
                'Revoke All'
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {revokeAllOtherSessionsMutation.isSuccess && (
          <div className='mb-6'>
            <Alert variant='success'>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                All other sessions have been revoked successfully!
              </AlertDescription>
            </Alert>
          </div>
        )}

        {revokeAllSessionsMutation.isSuccess && (
          <div className='mb-6'>
            <Alert variant='success'>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>All sessions have been revoked successfully!</AlertDescription>
            </Alert>
          </div>
        )}

        {sessions.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <Lucide.Smartphone className='mb-4 h-12 w-12 text-gray-400' />
            <h3 className='text-lg font-medium text-gray-900'>No active sessions</h3>
            <Text className='text-muted mt-1 text-sm'>
              You don't have any active sessions at the moment.
            </Text>
          </div>
        ) : (
          <Stack>
            {sessions.map((session) => (
              <Item
                key={session.session_id}
                variant='plain'
                className={
                  session.session_id === currentSessionId ? 'border-blue-200 bg-blue-50' : ''
                }
              >
                <ItemMedia>
                  <Lucide.Smartphone className='size-10' />
                </ItemMedia>
                <ItemContent>
                  <div className='flex items-center gap-2'>
                    <ItemTitle>{session.device_info || 'Unknown Device'}</ItemTitle>
                    {session.session_id === currentSessionId && (
                      <Badge variant='info' size='sm'>
                        Current
                      </Badge>
                    )}
                  </div>
                  <ItemDescription className='flex flex-col gap-1 sm:flex-row sm:gap-4'>
                    <span className='flex items-center gap-1'>
                      <Lucide.MapPin className='h-3 w-3' />
                      {session.ip_address || 'Unknown IP'}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Lucide.Clock className='h-3 w-3' />
                      Last active: {formatRelativeTime(session.last_activity_at)}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Lucide.Calendar className='h-3 w-3' />
                      {formatDate(session.created_at)}
                    </span>
                  </ItemDescription>
                </ItemContent>
                {session.session_id !== currentSessionId && (
                  <ItemAction>
                    <Button
                      variant='danger'
                      size='sm'
                      onClick={() => handleRevokeSession(session.session_id)}
                      disabled={revokeSessionMutation.isPending}
                    >
                      Revoke
                    </Button>
                  </ItemAction>
                )}
              </Item>
            ))}
          </Stack>
        )}

        <div className='mt-6 rounded-md border border-blue-200 bg-blue-50 p-4'>
          <div className='flex gap-3'>
            <Lucide.Info className='mt-0.5 h-5 w-5 shrink-0 text-blue-600' />
            <div>
              <h4 className='text-sm font-medium text-blue-900'>About sessions</h4>
              <Text className='text-muted mt-1 text-xs'>
                Sessions represent your signed-in devices. You can revoke sessions to sign out from
                specific devices. Revoking current session will sign you out from this device.
              </Text>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
