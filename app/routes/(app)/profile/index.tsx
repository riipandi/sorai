import { useForm } from '@tanstack/react-form'
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { Alert } from '#/components/selia/alert'
import { Button } from '#/components/selia/button'
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '#/components/selia/card'
import { Field, FieldError, FieldLabel } from '#/components/selia/field'
import { Fieldset } from '#/components/selia/fieldset'
import { Form } from '#/components/selia/form'
import { Input } from '#/components/selia/input'
import { Spinner } from '#/components/selia/spinner'
import { Text, TextLink } from '#/components/selia/text'
import fetcher from '#/fetcher'
import type { UserProfileResponse } from '#/schemas/api.schema'

// Zod schema for form validation
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters')
})

const whoamiQuery = queryOptions({
  queryKey: ['whoami'],
  queryFn: () => fetcher<UserProfileResponse>('/auth/whoami')
})

export const Route = createFileRoute('/(app)/profile/')({
  component: RouteComponent
})

function RouteComponent() {
  const queryClient = useQueryClient()

  // Fetch user profile data from /auth/whoami endpoint
  const { data: profileData, isLoading, error } = useSuspenseQuery(whoamiQuery)

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values: { name: string }) => {
      return fetcher('/user/profile', {
        method: 'PUT',
        body: { name: values.name }
      })
    },
    onSuccess: () => {
      // Invalidate whoami query to refresh data
      queryClient.invalidateQueries({ queryKey: ['whoami'] })
    }
  })

  const form = useForm({
    defaultValues: { name: profileData?.data?.name || '' },
    onSubmit: async ({ value }) => {
      // Validate with Zod before submitting
      const result = profileSchema.safeParse(value)
      if (!result.success) {
        const firstError = result.error.issues[0]
        if (firstError) {
          form.setFieldValue('name', value.name)
          throw new Error(firstError.message)
        }
        return
      }

      await updateProfileMutation.mutateAsync(value)
    }
  })

  // Update form values when profile data loads
  if (profileData?.data?.name && form.state.values.name !== profileData.data.name) {
    form.setFieldValue('name', profileData.data.name)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }

  if (isLoading) {
    return (
      <div className='flex min-h-100 items-center justify-center'>
        <div className='flex items-center gap-2 text-gray-500'>
          <Spinner className='size-5' strokeWidth={2.0} />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return <Alert variant='danger'>Failed to load profile. Please try again later.</Alert>
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your account information below</CardDescription>
      </CardHeader>
      <CardBody>
        {updateProfileMutation.isSuccess && (
          <div className='mb-6'>
            <Alert variant='success'>Profile updated successfully!</Alert>
          </div>
        )}

        {updateProfileMutation.error && (
          <div className='mb-6'>
            <Alert variant='danger'>
              {updateProfileMutation.error instanceof Error
                ? updateProfileMutation.error.message
                : 'Failed to update profile. Please try again.'}
            </Alert>
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Fieldset>
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
                    autoComplete='name'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='John Doe'
                    disabled={updateProfileMutation.isPending}
                  />
                  <FieldError match='valueMissing'>Name is required</FieldError>
                  <FieldError match='tooShort'>Name must be at least 2 characters</FieldError>
                </Field>
              )}
            </form.Field>

            {/* Display read-only email */}
            <Field>
              <FieldLabel htmlFor='email'>Email Address</FieldLabel>
              <Input
                id='email'
                type='email'
                autoComplete='email'
                value={profileData?.data?.email || ''}
                disabled
                placeholder='john@example.com'
              />
              <Text className='text-muted mt-1.5 text-xs'>
                To change your email, go to{' '}
                <TextLink render={<Link to='/profile/change-email' />}>Change Email</TextLink> page.
              </Text>
            </Field>

            {/* Display read-only user ID */}
            <Field>
              <FieldLabel htmlFor='userId'>User ID</FieldLabel>
              <Input id='userId' type='text' value={profileData?.data?.user_id || ''} disabled />
            </Field>
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
                  disabled={!canSubmit || isSubmitting || updateProfileMutation.isPending}
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
              </div>
            )}
          />
        </Form>
      </CardBody>
    </Card>
  )
}
