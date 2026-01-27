import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Alert } from '#/components/selia/alert'
import { Button } from '#/components/selia/button'
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '#/components/selia/card'
import { Field, FieldError, FieldLabel } from '#/components/selia/field'
import { Fieldset } from '#/components/selia/fieldset'
import { Form } from '#/components/selia/form'
import { Input } from '#/components/selia/input'
import { Spinner } from '#/components/selia/spinner'
import { PasswordStrength } from '#/components/ui/PasswordStrength'
import fetcher from '#/fetcher'

// Zod schema for form validation
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export const Route = createFileRoute('/(app)/profile/change-password')({
  component: RouteComponent
})

function RouteComponent() {
  const { queryClient } = Route.useRouteContext()

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (values: { current_password: string; new_password: string }) => {
      return fetcher('/auth/password/change', {
        method: 'POST',
        body: {
          current_password: values.current_password,
          new_password: values.new_password
        }
      })
    },
    onSuccess: () => {
      // Invalidate whoami query to refresh data
      queryClient.invalidateQueries({ queryKey: ['whoami'] })
    }
  })

  const form = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      // Validate with Zod before submitting
      const result = changePasswordSchema.safeParse(value)
      if (!result.success) {
        const firstError = result.error.issues[0]
        if (firstError) {
          throw new Error(firstError.message)
        }
        return
      }

      await changePasswordMutation.mutateAsync({
        current_password: value.currentPassword,
        new_password: value.newPassword
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
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Ensure your account is using a long, random password to stay secure
        </CardDescription>
      </CardHeader>
      <CardBody>
        {changePasswordMutation.isSuccess && (
          <div className='mb-6'>
            <Alert variant='success'>Password changed successfully!</Alert>
          </div>
        )}

        {changePasswordMutation.error && (
          <div className='mb-6'>
            <Alert variant='danger'>
              {changePasswordMutation.error instanceof Error
                ? changePasswordMutation.error.message
                : 'Failed to change password. Please try again.'}
            </Alert>
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Fieldset>
            <form.Field
              name='currentPassword'
              validators={{
                onChange: ({ value }) => {
                  const result = changePasswordSchema.shape.currentPassword.safeParse(value)
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
                  <FieldLabel htmlFor='currentPassword'>Current Password</FieldLabel>
                  <Input
                    id='currentPassword'
                    name={field.name}
                    type='password'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='••••••••'
                    autoComplete='current-password'
                    disabled={changePasswordMutation.isPending}
                  />
                  <FieldError match='valueMissing'>Current password is required</FieldError>
                </Field>
              )}
            </form.Field>

            <form.Field
              name='newPassword'
              validators={{
                onChange: ({ value }) => {
                  const result = changePasswordSchema.shape.newPassword.safeParse(value)
                  if (!result.success) {
                    const firstError = result.error.issues[0]
                    return firstError ? firstError.message : undefined
                  }
                  return undefined
                },
                onChangeAsync: async ({ value, fieldApi }) => {
                  // If confirmPassword has a value, re-validate it when password changes
                  const confirmPasswordValue = fieldApi.form.getFieldValue('confirmPassword')
                  if (confirmPasswordValue && confirmPasswordValue !== value) {
                    // Trigger re-validation of confirmPassword field
                    fieldApi.form.setFieldValue('confirmPassword', confirmPasswordValue)
                  }
                }
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor='newPassword'>New Password</FieldLabel>
                  <Input
                    id='newPassword'
                    name={field.name}
                    type='password'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='••••••••'
                    autoComplete='new-password'
                    disabled={changePasswordMutation.isPending}
                  />
                  <PasswordStrength password={field.state.value} className='mt-2' />
                </Field>
              )}
            </form.Field>

            <form.Field
              name='confirmPassword'
              validators={{
                onChange: ({ value, fieldApi }) => {
                  // Check if confirmPassword is not empty
                  if (!value || value.trim() === '') {
                    return 'Please confirm your new password'
                  }

                  // Get the password field value
                  const passwordValue = fieldApi.form.getFieldValue('newPassword')

                  // Check if passwords match
                  if (value !== passwordValue) {
                    return 'Passwords do not match'
                  }

                  return undefined
                }
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor='confirmPassword'>Confirm New Password</FieldLabel>
                  <Input
                    id='confirmPassword'
                    name={field.name}
                    type='password'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='••••••••'
                    autoComplete='new-password'
                    disabled={changePasswordMutation.isPending}
                  />
                  <FieldError match='valueMissing'>Please confirm your new password</FieldError>
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
                  disabled={!canSubmit || isSubmitting || changePasswordMutation.isPending}
                >
                  {isSubmitting || changePasswordMutation.isPending ? (
                    <span className='flex items-center gap-2'>
                      <Spinner className='size-4' strokeWidth={2.0} />
                      Changing...
                    </span>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </div>
            )}
          />
        </Form>
      </CardBody>
    </Card>
  )
}
