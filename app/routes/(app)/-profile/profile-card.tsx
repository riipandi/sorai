import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Button } from '#/components/button'
import { Card, CardBody, CardTitle } from '#/components/card'
import { CardDescription, CardFooter, CardHeader } from '#/components/card'
import { Field, FieldError, FieldLabel } from '#/components/field'
import { Fieldset } from '#/components/fieldset'
import { Form } from '#/components/form'
import { Input } from '#/components/input'
import { Spinner } from '#/components/spinner'
import { useAuth } from '#/guards'
import { fetcher } from '#/utils/fetcher'

const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must not exceed 100 characters' })
})

interface ProfileInfoCardProps {
  onNotification: (type: 'success' | 'error', message: string) => void
}

export function ProfileInfoCard({ onNotification }: ProfileInfoCardProps) {
  const { user, refetchUser } = useAuth()
  const queryClient = useQueryClient()

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetcher<{
        status: 'success' | 'error'
        message: string
        data: { user_id: string; email: string; name: string } | null
        error: any
      }>('/user/profile', {
        method: 'PUT',
        body: { name }
      })

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to update profile')
      }

      return response.data
    },
    onSuccess: async () => {
      onNotification('success', 'Profile updated successfully!')

      // Invalidate user profile query to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })

      // Also refetch from auth context
      await refetchUser()
    },
    onError: (error: Error) => {
      onNotification('error', error.message || 'Failed to update profile. Please try again.')
    }
  })

  const form = useForm({
    defaultValues: { name: user?.name || '' },
    onSubmit: async ({ value }) => {
      const result = profileSchema.safeParse(value)
      if (!result.success) {
        const firstError = result.error.issues[0]
        const errMessage = firstError ? firstError.message : 'Please check your input and try again'
        onNotification('error', errMessage)
        return
      }

      // Use mutation instead of direct fetch
      updateProfileMutation.mutate(value.name)
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account information below</CardDescription>
        </CardHeader>
        <CardBody className='space-y-6 lg:space-y-0'>
          <Fieldset className='grid grid-cols-1 lg:grid-cols-2 lg:gap-6'>
            <form.Field
              name='name'
              validators={{
                onChange: ({ value }) => {
                  const result = profileSchema.shape.name.safeParse(value)
                  if (!result.success) {
                    const firstError = result.error.issues[0]
                    return firstError ? firstError.message : undefined
                  }
                  return undefined
                }
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor='name'>Full Name</FieldLabel>
                  <Input
                    id='name'
                    type='text'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='Enter your full name'
                  />
                  {field.state.meta.errors.map((error) => (
                    <FieldError key={error}>{error}</FieldError>
                  ))}
                </Field>
              )}
            </form.Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                className='bg-accent/70'
                placeholder='john@example.com'
                value={user?.email || ''}
                disabled
                readOnly
              />
            </Field>
          </Fieldset>
        </CardBody>
        <CardFooter className='justify-end space-x-2'>
          <Button type='button' variant='outline' onClick={() => form.reset()}>
            Cancel
          </Button>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type='submit'
                disabled={!canSubmit || isSubmitting || updateProfileMutation.isPending}
                variant='primary'
              >
                {isSubmitting || updateProfileMutation.isPending ? (
                  <span className='flex items-center gap-2'>
                    <Spinner className='size-4' strokeWidth={2.0} />
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </Card>
    </Form>
  )
}
