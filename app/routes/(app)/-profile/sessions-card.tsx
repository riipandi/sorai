import { useStore } from '@nanostores/react'
import { useNavigate } from '@tanstack/react-router'
import { decodeJwt } from 'jose'
import * as Lucide from 'lucide-react'
import { Activity, useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogClose,
  AlertDialogPopup,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '#/components/alert-dialog'
import { Badge } from '#/components/badge'
import { Button } from '#/components/button'
import { Card, CardBody, CardHeaderAction, CardTitle } from '#/components/card'
import { CardDescription, CardFooter, CardHeader } from '#/components/card'
import { Input } from '#/components/input'
import {
  Item,
  ItemAction,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '#/components/item'
import { Spinner } from '#/components/spinner'
import { Stack } from '#/components/stack'
import { Text } from '#/components/typography'
import { useAuth } from '#/guards'
import {
  getUserSessions,
  revokeAllSessions,
  revokeOtherSessions,
  revokeSession
} from '#/services/auth.service'
import { authStore } from '#/stores'
import { clx } from '#/utils/variant'

interface Session {
  id: string
  ip_address: string
  device_info: string
  last_activity_at: number
  expires_at: number
  created_at: number
}

interface SessionsCardProps {
  onNotification: (type: 'success' | 'error', message: string) => void
}

export function SessionsCard({ onNotification }: SessionsCardProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const authState = useStore(authStore)
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true)
      const token = authState?.atoken

      if (token) {
        try {
          const payload = decodeJwt<{ sid?: string }>(token)
          setCurrentSessionId(payload?.sid || null)
        } catch (error) {
          console.error('Failed to decode token:', error)
        }
      }

      const fetchedSessions = await getUserSessions()
      setSessions(fetchedSessions)
      setIsLoading(false)
    }

    fetchSessions()
  }, [authState?.atoken])

  const handleRevokeSession = async (sessionId: string) => {
    const success = await revokeSession(sessionId)
    if (success) {
      if (sessionId === currentSessionId) {
        onNotification('success', 'Current session revoked. Please sign in again.')
        await logout()
        navigate({ to: '/signin' })
      } else {
        setSessions(sessions.filter((s) => s.id !== sessionId))
        onNotification('success', 'Session revoked successfully')
      }
    } else {
      onNotification('error', 'Failed to revoke session')
    }
  }

  const handleRevokeOthers = async () => {
    const success = await revokeOtherSessions()
    if (success) {
      setSessions(sessions.filter((s) => s.id === currentSessionId))
      onNotification('success', 'Other sessions revoked successfully')
    } else {
      onNotification('error', 'Failed to revoke other sessions')
    }
  }

  const handleRevokeAll = async () => {
    const success = await revokeAllSessions()
    if (success) {
      setSessions([])
      onNotification('success', 'All sessions revoked successfully')
      await logout()
      navigate({ to: '/signin' })
    } else {
      onNotification('error', 'Failed to revoke all sessions')
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const filteredSessions = sessions.filter(
    (session) =>
      session.device_info.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.ip_address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active sessions across devices ({filteredSessions.length})
          </CardDescription>
          <CardHeaderAction className='gap-2'>
            <Button
              size='icon'
              variant='plain'
              className='w-12'
              onClick={() => console.info('refecth session')}
            >
              <Lucide.RefreshCcw className='text-muted size-5' />
            </Button>
            <Input
              placeholder='Find session'
              className='min-w-60'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CardHeaderAction>
        </CardHeader>
        <CardBody className='p-12'>
          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <Spinner className='size-6' strokeWidth={2.0} />
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <Lucide.Shield className='text-dimmed mb-4 size-12' />
              <Text className='text-dimmed'>No active sessions found</Text>
            </div>
          ) : (
            <Stack spacing='md'>
              {filteredSessions.map((session) => {
                const isCurrent = session.id === currentSessionId
                return (
                  <Item key={session.id} variant={isCurrent ? 'info-outline' : 'default'}>
                    <ItemMedia className='flex items-center'>
                      <Lucide.Laptop
                        className={clx('size-8', isCurrent ? 'text-info' : 'text-dimmed')}
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{session.device_info || 'Unknown Device'}</ItemTitle>
                      <ItemDescription>
                        {session.ip_address} • Last active {formatDate(session.last_activity_at)}
                      </ItemDescription>
                    </ItemContent>
                    <ItemAction>
                      {isCurrent && (
                        <Badge variant='info-outline' size='sm'>
                          Current
                        </Badge>
                      )}
                      {!isCurrent && (
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button variant='plain' size='sm'>
                                Revoke
                              </Button>
                            }
                          />
                          <AlertDialogPopup>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke session</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogBody>
                              <AlertDialogDescription>
                                Are you sure you want to revoke this session?
                              </AlertDialogDescription>
                            </AlertDialogBody>
                            <AlertDialogFooter>
                              <AlertDialogClose>Cancel</AlertDialogClose>
                              <AlertDialogClose
                                render={
                                  <Button
                                    variant='danger'
                                    onClick={() => handleRevokeSession(session.id)}
                                  >
                                    Revoke
                                  </Button>
                                }
                              />
                            </AlertDialogFooter>
                          </AlertDialogPopup>
                        </AlertDialog>
                      )}

                      <Activity mode={isCurrent ? 'visible' : 'hidden'}>
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button variant='plain' size='sm'>
                                Revoke
                              </Button>
                            }
                          />
                          <AlertDialogPopup>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke current session?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogBody>
                              <AlertDialogDescription>
                                This will sign you out of this device immediately.
                                <br /> You will need to sign in again to continue.
                              </AlertDialogDescription>
                            </AlertDialogBody>
                            <AlertDialogFooter>
                              <AlertDialogClose>Cancel</AlertDialogClose>
                              <AlertDialogClose
                                render={
                                  <Button
                                    variant='danger'
                                    onClick={() => handleRevokeSession(session.id)}
                                  >
                                    Sign Out
                                  </Button>
                                }
                              />
                            </AlertDialogFooter>
                          </AlertDialogPopup>
                        </AlertDialog>
                      </Activity>
                    </ItemAction>
                  </Item>
                )
              })}
            </Stack>
          )}
        </CardBody>
        <CardFooter className='justify-end space-x-2'>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant='tertiary'>Revoke Others</Button>} />
            <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke other sessions</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogBody>
                <AlertDialogDescription>
                  Are you sure you want to revoke all other sessions? <br />
                  This will sign you out of all other devices.
                </AlertDialogDescription>
              </AlertDialogBody>
              <AlertDialogFooter>
                <AlertDialogClose>Cancel</AlertDialogClose>
                <AlertDialogClose
                  render={
                    <Button variant='danger' onClick={handleRevokeOthers}>
                      Revoke
                    </Button>
                  }
                />
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger render={<Button variant='danger'>Revoke All</Button>} />
            <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke all sessions?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogBody>
                <AlertDialogDescription>
                  This will sign you out of all devices including this one.
                  <br /> You will need to sign in again to continue.
                </AlertDialogDescription>
              </AlertDialogBody>
              <AlertDialogFooter>
                <AlertDialogClose>Cancel</AlertDialogClose>
                <AlertDialogClose
                  render={
                    <Button variant='danger' onClick={handleRevokeAll}>
                      Revoke All
                    </Button>
                  }
                />
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialog>
        </CardFooter>
      </Card>
    </>
  )
}
