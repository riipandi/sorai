import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
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

const emailSchema = z.object({
  new_email: z.email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' })
})

interface ChangeEmailCardProps {
  onNotification: (type: 'success' | 'error', message: string) => void
}

export function ChangeEmailCard({ onNotification }: ChangeEmailCardProps) {
  const { user } = useAuth()

  // Change email mutation
  const changeEmailMutation = useMutation({
    mutationFn: async (data: { new_email: string; password: string }) => {
      const response = await fetcher<{
        status: 'success' | 'error'
        message: string
        data: null
        error: any
      }>('/user/email/change', {
        method: 'POST',
        body: data
      })

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to change email')
      }

      return response
    },
    onSuccess: (response) => {
      onNotification(
        'success',
        response.message || 'Confirmation email has been sent to your new email address.'
      )
    },
    onError: (error: Error) => {
      onNotification('error', error.message || 'Failed to change email. Please try again.')
    }
  })

  const form = useForm({
    defaultValues: { new_email: '', password: '' },
    onSubmit: async ({ value }) => {
      const result = emailSchema.safeParse(value)
      if (!result.success) {
        const firstError = result.error.issues[0]
        const errMessage = firstError ? firstError.message : 'Please check your input and try again'
        onNotification('error', errMessage)
        return
      }

      // Use mutation instead of direct fetch
      changeEmailMutation.mutate(
        { new_email: value.new_email, password: value.password },
        {
          onSuccess: () => {
            form.reset()
          }
        }
      )
    }
  })

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
          <CardDescription>
            Update your email address for account notifications and login
          </CardDescription>
        </CardHeader>
        <CardBody className='space-y-6 lg:space-y-0'>
          <Fieldset className='grid grid-cols-1 lg:grid-cols-2 lg:gap-6'>
            <Field>
              <FieldLabel>Current Email Address</FieldLabel>
              <Input
                className='bg-accent/70'
                placeholder='john@example.com'
                value={user?.email || ''}
                disabled
                readOnly
              />
            </Field>
            <form.Field
              name='new_email'
              validators={{
                onChange: ({ value }) => {
                  const result = emailSchema.shape.new_email.safeParse(value)
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
                  <FieldLabel htmlFor='new_email'>New Email Address</FieldLabel>
                  <Input
                    id='new_email'
                    type='email'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='Enter your new email'
                  />
                  {field.state.meta.errors.map((error) => (
                    <FieldError key={error}>{error}</FieldError>
                  ))}
                </Field>
              )}
            </form.Field>
          </Fieldset>
          <Fieldset>
            <form.Field
              name='password'
              validators={{
                onChange: ({ value }) => {
                  const result = emailSchema.shape.password.safeParse(value)
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
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <Input
                    id='password'
                    type='password'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='Enter your password'
                  />
                  {field.state.meta.errors.map((error) => (
                    <FieldError key={error}>{error}</FieldError>
                  ))}
                </Field>
              )}
            </form.Field>
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
                disabled={!canSubmit || isSubmitting || changeEmailMutation.isPending}
                variant='primary'
              >
                {isSubmitting || changeEmailMutation.isPending ? (
                  <span className='flex items-center gap-2'>
                    <Spinner className='size-4' strokeWidth={2.0} />
                    Sending...
                  </span>
                ) : (
                  'Send Confirmation Email'
                )}
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </Card>
    </Form>
  )
}
