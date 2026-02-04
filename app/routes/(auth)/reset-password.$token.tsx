import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link } from '@tanstack/react-router'
import * as Lucide from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from '#/components/alert'
import { Button } from '#/components/button'
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '#/components/card'
import { Field, FieldLabel, FieldError } from '#/components/field'
import { Fieldset } from '#/components/fieldset'
import { Form } from '#/components/form'
import { Input } from '#/components/input'
import { InputPassword } from '#/components/input-password'
import { Spinner } from '#/components/spinner'
import { TextLink } from '#/components/typography'
import { fetcher } from '#/utils/fetcher'

export const Route = createFileRoute('/(auth)/reset-password/$token')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { token } = params

    if (!token || token.trim() === '') {
      return { isValidToken: false }
    }

    try {
      const response = await fetcher<{
        status: 'success' | 'error'
        message: string
        data: { is_token_valid: boolean }
        error: any
      }>(`/auth/validate-token?token=${token}`, {
        method: 'GET'
      })

      return { isValidToken: response.status === 'success' && response.data?.is_token_valid }
    } catch (error) {
      console.error(error)
      return { isValidToken: false }
    }
  }
})

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

function RouteComponent() {
  const { token } = Route.useParams()
  const loaderData = Route.useLoaderData()
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { password: '', confirmPassword: '' },
    validators: { onChange: resetPasswordSchema },
    onSubmit: async ({ value, formApi }) => {
      setSubmitError(null)

      const result = resetPasswordSchema.safeParse(value)
      if (!result.success) {
        const firstError = result.error.issues[0]
        const errMessage = firstError ? firstError.message : 'Please check your input and try again'
        setSubmitError(errMessage)
        return
      }

      try {
        const response = await fetcher<{
          status: 'success' | 'error'
          message: string
          data: null
          error: any
        }>('/auth/password/reset', {
          method: 'POST',
          body: { token, password: value.password }
        })

        if (response.status === 'success') {
          setIsSuccess(true)
          setSuccessMessage(response.message)
          formApi.reset()
        }
      } catch (error: any) {
        setSubmitError(error?.data?.message || error?.message || 'Failed to reset password')
      }
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }

  const isInvalidToken = !loaderData?.isValidToken

  return (
    <div className='w-full max-w-md space-y-8 p-8'>
      <Card className='w-full min-w-sm'>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            {isInvalidToken ? 'Invalid or expired reset token' : 'Enter your new password below'}
          </CardDescription>
        </CardHeader>
        <CardBody>
          {isInvalidToken ? (
            <div className='space-y-6'>
              <Alert variant='danger'>
                <Lucide.XCircleIcon />
                <div>
                  <AlertTitle>Invalid or expired link</AlertTitle>
                  <AlertDescription>
                    This password reset link is invalid or has expired. Please request a new one.
                  </AlertDescription>
                </div>
              </Alert>
              <div className='flex flex-col space-y-3'>
                <Link to='/forgot-password'>
                  <Button block>Request New Reset Link</Button>
                </Link>
                <Link to='/signin'>
                  <Button variant='outline' block>
                    Back to Sign in
                  </Button>
                </Link>
              </div>
            </div>
          ) : isSuccess ? (
            <div className='space-y-6'>
              <Alert variant='success'>
                <Lucide.CheckCircle2Icon />
                <div>
                  <AlertTitle>Password reset successful</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </div>
              </Alert>
              <Link to='/signin'>
                <Button block>Sign in with your new password</Button>
              </Link>
            </div>
          ) : (
            <>
              {submitError && (
                <div className='mb-6'>
                  <Alert variant='danger'>{submitError}</Alert>
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Fieldset>
                  <form.Field
                    name='password'
                    validators={{
                      onChange: ({ value }) => {
                        const result = resetPasswordSchema.shape.password.safeParse(value)
                        if (!result.success) {
                          const firstError = result.error.issues[0]
                          return firstError ? firstError.message : undefined
                        }
                        return undefined
                      },
                      onChangeAsync: async ({ value, fieldApi }) => {
                        const confirmPasswordValue = fieldApi.form.getFieldValue('confirmPassword')
                        if (confirmPasswordValue && confirmPasswordValue !== value) {
                          fieldApi.form.setFieldValue('confirmPassword', confirmPasswordValue)
                        }
                      }
                    }}
                  >
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor='password'>New Password</FieldLabel>
                        <InputPassword
                          id='password'
                          autoComplete='new-password'
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder='•••••••••'
                          strengthIndicator
                          autoFocus
                        />
                        <FieldError match='valueMissing'>Password is required</FieldError>
                      </Field>
                    )}
                  </form.Field>

                  <form.Field
                    name='confirmPassword'
                    validators={{
                      onChange: ({ value, fieldApi }) => {
                        if (!value || value.trim() === '') {
                          return 'Please confirm your password'
                        }

                        const passwordValue = fieldApi.form.getFieldValue('password')

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
                          type='password'
                          autoComplete='new-password'
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder='•••••••••'
                        />
                        <FieldError match='valueMissing'>Please confirm your password</FieldError>
                      </Field>
                    )}
                  </form.Field>
                </Fieldset>

                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                  {([canSubmit, isSubmitting]) => (
                    <Button type='submit' disabled={!canSubmit || isSubmitting} block>
                      {isSubmitting ? (
                        <span className='flex items-center gap-2'>
                          <Spinner className='size-4' strokeWidth={2.0} />
                          Resetting...
                        </span>
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  )}
                </form.Subscribe>
              </Form>

              <div className='mt-6 flex w-full items-center justify-center text-center'>
                <TextLink className='no-underline' render={<Link to='/signin' />}>
                  Back to Sign in
                </TextLink>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
