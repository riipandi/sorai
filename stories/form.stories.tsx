import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '#/components/selia/button'
import { Field, FieldError, FieldLabel } from '#/components/selia/field'
import { Fieldset, FieldsetLegend } from '#/components/selia/fieldset'
import { Form } from '#/components/selia/form'
import { Input } from '#/components/selia/input'
import { Text } from '#/components/selia/text'

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
    <Form className='w-full min-w-md xl:w-8/12'>
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
