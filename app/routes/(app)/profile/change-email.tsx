import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from '#/components/selia/alert'
import { Button } from '#/components/selia/button'
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '#/components/selia/card'
import { Field, FieldError, FieldLabel } from '#/components/selia/field'
import { Fieldset } from '#/components/selia/fieldset'
import { Form } from '#/components/selia/form'
import { Input } from '#/components/selia/input'
import { Label } from '#/components/selia/label'
import { Spinner } from '#/components/selia/spinner'
import { Text } from '#/components/selia/text'
import fetcher from '#/fetcher'

// Zod schema for form validation
const changeEmailSchema = z.object({
  newEmail: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export const Route = createFileRoute('/(app)/profile/change-email')({
  component: RouteComponent
})

function RouteComponent() {
  const queryClient = useQueryClient()

  // Fetch user profile to get current email
  const { data: profileData } = useQuery({
    queryKey: ['whoami'],
    queryFn: () =>
      fetcher<{ success: boolean; data: { user_id: string; email: string; name: string } | null }>(
        '/auth/whoami'
      )
  })

  // Change email mutation
  const changeEmailMutation = useMutation({
    mutationFn: async (values: { new_email: string; password: string }) => {
      return fetcher('/user/email/change', {
        method: 'POST',
        body: {
          new_email: values.new_email,
          password: values.password
        }
      })
    },
    onSuccess: () => {
      // Invalidate whoami query to refresh data
      queryClient.invalidateQueries({ queryKey: ['whoami'] })
    }
  })

  const form = useForm({
    defaultValues: { newEmail: '', password: '' },
    onSubmit: async ({ value }) => {
      // Validate with Zod before submitting
      const result = changeEmailSchema.safeParse(value)
      if (!result.success) {
        const firstError = result.error.issues[0]
        if (firstError) {
          throw new Error(firstError.message)
        }
        return
      }

      await changeEmailMutation.mutateAsync({
        new_email: value.newEmail,
        password: value.password
      })
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Change Email</CardTitle>
        <CardDescription>
          Update your email address for account notifications and login
        </CardDescription>
      </CardHeader>
      <CardBody>
        {/* Current Email Display */}
        <div className='mb-6 rounded-md bg-gray-50 p-4'>
          <Label>Current Email</Label>
          <Text>{profileData?.data?.email || 'Loading...'}</Text>
        </div>

        {changeEmailMutation.isSuccess && (
          <div className='mb-6'>
            <Alert variant='success'>
              <AlertTitle>Email change request sent!</AlertTitle>
              <AlertDescription>
                We've sent a confirmation link to your new email address. Please check your inbox
                and click the link to complete the email change process.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {changeEmailMutation.error && (
          <div className='mb-6'>
            <Alert variant='danger'>
              {changeEmailMutation.error instanceof Error
                ? changeEmailMutation.error.message
                : 'Failed to request email change. Please try again.'}
            </Alert>
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Fieldset>
            <form.Field
              name='newEmail'
              validators={{
                onChange: ({ value }) => {
                  const result = changeEmailSchema.shape.newEmail.safeParse(value)
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
                  <FieldLabel htmlFor='newEmail'>New Email Address</FieldLabel>
                  <Input
                    id='newEmail'
                    name={field.name}
                    type='email'
                    autoComplete='email'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='new.email@example.com'
                    disabled={changeEmailMutation.isPending}
                  />
                  <FieldError match='valueMissing'>Email is required</FieldError>
                  <FieldError match='typeMismatch'>Invalid email address</FieldError>
                </Field>
              )}
            </form.Field>

            <form.Field
              name='password'
              validators={{
                onChange: ({ value }) => {
                  const result = changeEmailSchema.shape.password.safeParse(value)
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
                  <FieldLabel htmlFor='password'>Current Password</FieldLabel>
                  <Input
                    id='password'
                    name={field.name}
                    type='password'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='••••••••'
                    autoComplete='current-password'
                    disabled={changeEmailMutation.isPending}
                  />
                  <FieldError match='valueMissing'>Password is required</FieldError>
                </Field>
              )}
            </form.Field>
          </Fieldset>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <div className='mt-6 flex justify-end gap-3'>
                <Button variant='secondary' type='button' onClick={() => form.reset()}>
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={!canSubmit || isSubmitting || changeEmailMutation.isPending}
                >
                  {isSubmitting || changeEmailMutation.isPending ? (
                    <span className='flex items-center gap-2'>
                      <Spinner className='size-4' strokeWidth={2.0} />
                      Sending...
                    </span>
                  ) : (
                    'Send Confirmation'
                  )}
                </Button>
              </div>
            )}
          />
        </Form>

        <div className='mt-6 rounded-md border border-blue-200 bg-blue-50 p-4'>
          <div className='flex gap-3'>
            <svg
              className='mt-0.5 h-5 w-5 shrink-0 text-blue-600'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                clipRule='evenodd'
              />
            </svg>
            <div>
              <h4 className='text-sm font-medium text-blue-900'>Email change process</h4>
              <Text className='text-muted mt-1'>
                After submitting, we'll send a confirmation link to your new email address. You'll
                need to click the link to complete the email change. Your current email will remain
                active until the change is confirmed.
              </Text>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
