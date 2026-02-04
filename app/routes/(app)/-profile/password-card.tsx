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
import { InputPassword } from '#/components/input-password'
import { Spinner } from '#/components/spinner'
import { fetcher } from '#/utils/fetcher'

const passwordSchema = z
  .object({
    current_password: z.string().min(1, { message: 'Current password is required' }),
    new_password: z.string().min(6, { message: 'New password must be at least 6 characters' }),
    confirm_password: z.string().min(1, { message: 'Please confirm your new password' })
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: 'New password must be different from current password',
    path: ['new_password']
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password']
  })

interface ChangePasswordCardProps {
  onNotification: (type: 'success' | 'error', message: string) => void
}

export function ChangePasswordCard({ onNotification }: ChangePasswordCardProps) {
  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { current_password: string; new_password: string }) => {
      const response = await fetcher<{
        status: 'success' | 'error'
        message: string
        data: { revoked_tokens: number; deactivated_sessions: number } | null
        error: any
      }>('/auth/password/change', {
        method: 'POST',
        body: data
      })

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to change password')
      }

      return response
    },
    onSuccess: (response) => {
      onNotification(
        'success',
        response.message || 'Password changed successfully. Please sign in again.'
      )
    },
    onError: (error: Error) => {
      onNotification('error', error.message || 'Failed to change password. Please try again.')
    }
  })

  const form = useForm({
    defaultValues: { current_password: '', new_password: '', confirm_password: '' },
    validators: {
      onSubmit: passwordSchema
    },
    onSubmit: async ({ value }) => {
      const result = passwordSchema.safeParse(value)
      if (!result.success) {
        const firstError = result.error.issues[0]
        const errMessage = firstError ? firstError.message : 'Please check your input and try again'
        onNotification('error', errMessage)
        return
      }

      // Use mutation instead of direct fetch
      changePasswordMutation.mutate(
        {
          current_password: value.current_password,
          new_password: value.new_password
        },
        {
          onSuccess: () => {
            form.reset()
          }
        }
      )
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
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Ensure your account is using a long, random password to stay secure
          </CardDescription>
        </CardHeader>
        <CardBody>
          <Fieldset>
            <form.Field
              name='current_password'
              validators={{
                onChange: ({ value }) => {
                  const result = passwordSchema.shape.current_password.safeParse(value)
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
                  <FieldLabel htmlFor='current_password'>Current Password</FieldLabel>
                  <Input
                    id='current_password'
                    type='password'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='Enter your current password'
                  />
                  {field.state.meta.errors.map((error, idx) => (
                    <FieldError key={`${field.name}-error-${idx}`}>
                      {typeof error === 'string' ? error : error?.message || 'Error'}
                    </FieldError>
                  ))}
                </Field>
              )}
            </form.Field>
            <form.Field
              name='new_password'
              validators={{
                onChange: ({ value }) => {
                  const result = passwordSchema.shape.new_password.safeParse(value)
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
                  <FieldLabel htmlFor='new_password'>New Password</FieldLabel>
                  <InputPassword
                    id='new_password'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='Enter your new password'
                    strengthIndicator
                  />
                  {field.state.meta.errors.map((error, idx) => (
                    <FieldError key={`${field.name}-error-${idx}`}>
                      {typeof error === 'string' ? error : error?.message || 'Error'}
                    </FieldError>
                  ))}
                </Field>
              )}
            </form.Field>
            <form.Field
              name='confirm_password'
              validators={{
                onChange: ({ value, fieldApi }) => {
                  const newPassword = fieldApi.form.state.values.new_password
                  if (value && value !== newPassword) {
                    return 'Passwords do not match'
                  }
                  return undefined
                }
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor='confirm_password'>Confirm New Password</FieldLabel>
                  <Input
                    id='confirm_password'
                    type='password'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='Confirm your new password'
                  />
                  {field.state.meta.errors.map((error, idx) => (
                    <FieldError key={`${field.name}-error-${idx}`}>
                      {typeof error === 'string' ? error : error?.message || 'Error'}
                    </FieldError>
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
                disabled={!canSubmit || isSubmitting || changePasswordMutation.isPending}
                variant='primary'
              >
                {isSubmitting || changePasswordMutation.isPending ? (
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
