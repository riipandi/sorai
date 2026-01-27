import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Activity, useState } from 'react'
import { z } from 'zod'
import { Alert } from '#/components/selia/alert'
import { Button } from '#/components/selia/button'
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '#/components/selia/card'
import { Checkbox } from '#/components/selia/checkbox'
import { Field, FieldLabel, FieldError } from '#/components/selia/field'
import { Fieldset } from '#/components/selia/fieldset'
import { Form } from '#/components/selia/form'
import { Input } from '#/components/selia/input'
import { Label } from '#/components/selia/label'
import { Spinner } from '#/components/selia/spinner'
import { TextLink } from '#/components/selia/text'
import { useAuth } from '#/guards'

const signinSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address' }),
  password: z.string().min(1, { error: 'Password is required' }),
  remember: z.boolean()
})

export const Route = createFileRoute('/(auth)/signin')({
  component: RouteComponent
})

function RouteComponent() {
  const { login } = useAuth()

  const navigate = Route.useNavigate()
  const search = Route.useSearch() as { message?: string; type?: 'success' | 'error' }
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { email: '', password: '', remember: false },
    validators: { onChange: signinSchema },
    onSubmit: async ({ value, formApi }) => {
      setSubmitError(null)

      // Validate with Zod before submitting
      const result = signinSchema.safeParse(value)
      if (!result.success) {
        const firstError = result.error.issues[0]
        const errMessage = firstError ? firstError.message : 'Please check your input and try again'
        setSubmitError(errMessage)
        return
      }

      const loginResult = await login(value.email, value.password)
      if (!loginResult.success) {
        setSubmitError(loginResult.error || 'Invalid email or password. Please try again.')
        return formApi.resetField('password')
      }

      formApi.resetField('password')
      return navigate({ to: '/' })
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }

  return (
    <div className='w-full max-w-md space-y-8 p-8'>
      <Card className='w-full min-w-sm'>
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardBody>
          <Activity mode={search.message || submitError ? 'visible' : 'hidden'}>
            <div className='mb-6'>
              {search.message ? (
                <Alert variant={search.type === 'error' ? 'danger' : 'success'}>
                  {search.message}
                </Alert>
              ) : null}
              {submitError ? <Alert variant='danger'>{submitError}</Alert> : null}
            </div>
          </Activity>

          <Form onSubmit={handleSubmit}>
            <Fieldset>
              <form.Field
                name='email'
                validators={{
                  onChange: ({ value }) => {
                    const result = signinSchema.shape.email.safeParse(value)
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
                      placeholder='somebody@example.com'
                      autoFocus
                    />
                    <FieldError match='valueMissing'>Email is required</FieldError>
                  </Field>
                )}
              </form.Field>

              <form.Field
                name='password'
                validators={{
                  onChange: ({ value }) => {
                    const result = signinSchema.shape.password.safeParse(value)
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
                      autoComplete='current-password'
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder='****************'
                    />
                    <FieldError match='valueMissing'>Password is required</FieldError>
                  </Field>
                )}
              </form.Field>
            </Fieldset>

            <form.Field name='remember'>
              {(field) => (
                <Field className='-mt-3'>
                  <Label>
                    <Checkbox name={field.name} />
                    <span>Remember me</span>
                  </Label>
                </Field>
              )}
            </form.Field>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type='submit' disabled={!canSubmit || isSubmitting} block>
                  {isSubmitting ? (
                    <span className='flex items-center gap-2'>
                      <Spinner className='size-4' strokeWidth={2.0} />
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              )}
            />
          </Form>

          <div className='mt-6 flex w-full items-center justify-center text-center'>
            <TextLink render={<Link to='/forgot-password' />}>Forgot your password?</TextLink>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
