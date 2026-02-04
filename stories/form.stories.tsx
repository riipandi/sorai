import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '#/components/button'
import { Field, FieldError, FieldLabel } from '#/components/field'
import { Fieldset, FieldsetLegend } from '#/components/fieldset'
import { Form } from '#/components/form'
import { Input } from '#/components/input'
import { Text } from '#/components/typography'

const meta = {
  title: 'Components/Form',
  component: Form,
  parameters: { layout: 'centered' },
  argTypes: {},
  tags: [], // ['autodocs']
  args: {},
  decorators: [
    (Story) => (
      <div className='flex w-full min-w-md items-center justify-center'>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Form className='w-full max-w-sm'>
      <Fieldset>
        <FieldsetLegend>Personal Information</FieldsetLegend>
        <Text>We need your name and email to create your account.</Text>
        <Field>
          <FieldLabel htmlFor='name'>Name</FieldLabel>
          <Input id='name' placeholder='Enter your name' required />
          <FieldError match='valueMissing'>This is required</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor='email'>Email</FieldLabel>
          <Input id='email' placeholder='Enter your email' required />
          <FieldError match='valueMissing'>This is required</FieldError>
        </Field>
      </Fieldset>
      <Button type='submit' block>
        Create Account
      </Button>
    </Form>
  )
}
