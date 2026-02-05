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
import { Spinner } from '#/components/spinner'
import { TextLink } from '#/components/typography'
import { fetcher } from '#/utils/fetcher'

const forgotPasswordSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address' })
})

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: RouteComponent
})

function RouteComponent() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { email: '' },
    validators: { onChange: forgotPasswordSchema },
    onSubmit: async ({ value, formApi }) => {
      setSubmitError(null)

      const result = forgotPasswordSchema.safeParse(value)
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
          data: {
            token?: string
            reset_link?: string
            expires_at?: number
          } | null
          error: any
        }>('/auth/password/forgot', {
          method: 'POST',
          body: { email: value.email }
        })

        if (response.status === 'success') {
          setIsSuccess(true)
          setSuccessMessage(response.message)
          formApi.reset()
        }
      } catch (error: any) {
        setSubmitError(error?.data?.message || error?.message || 'Failed to send reset email')
      }
    }
  })

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }

  const handleTryAnother = () => {
    setIsSuccess(false)
    setSuccessMessage('')
    setSubmitError(null)
    form.reset()
  }

  return (
    <div className='w-full max-w-md space-y-8 p-8'>
      <Card className='w-full min-w-sm'>
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription className='text-sm'>
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardBody>
          {isSuccess ? (
            <div className='space-y-6'>
              <Alert variant='success'>
                <Lucide.CheckCircle2Icon />
                <div>
                  <AlertTitle>Check your email</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </div>
              </Alert>

              <div className='flex flex-col space-y-3'>
                <Link to='/signin'>
                  <Button block>Back to Sign in</Button>
                </Link>
                <Button variant='outline' onClick={handleTryAnother} block>
                  Try another email
                </Button>
              </div>
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
                    name='email'
                    validators={{
                      onChange: ({ value }) => {
                        const result = forgotPasswordSchema.shape.email.safeParse(value)
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
                        <FieldLabel htmlFor='email'>Email address</FieldLabel>
                        <Input
                          id='email'
                          type='email'
                          autoComplete='email'
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder='you@example.com'
                          autoFocus
                        />
                        <FieldError match='valueMissing'>Email is required</FieldError>
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
                          Sending...
                        </span>
                      ) : (
                        'Send Reset Link'
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
