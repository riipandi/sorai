import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldDescription, FieldError, FieldLabel } from '#/components/selia/field'
import { Fieldset, FieldsetLegend } from '#/components/selia/fieldset'
import { Input } from '#/components/selia/input'
import { Text } from '#/components/selia/text'

const meta = {
  title: 'Components/Fieldset',
  component: Fieldset,
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
} satisfies Meta<typeof Fieldset>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='xl:w-10/12 2xl:w-8/12'>
      <Fieldset>
        <FieldsetLegend>Personal Information</FieldsetLegend>
        <Text>
          This information will be used to create your account. You can always change this
          information later.
        </Text>
        <Field>
          <FieldLabel htmlFor='name1'>Name</FieldLabel>
          <Input id='name1' placeholder='Enter your name' required />
          <FieldError match='valueMissing'>This is required</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor='email1'>Email</FieldLabel>
          <Input id='email1' placeholder='Enter your email' required />
          <FieldError match='valueMissing'>This is required</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor='password1'>Password</FieldLabel>
          <Input id='password1' type='password' placeholder='Enter your password' required />
          <FieldError match='valueMissing'>This is required</FieldError>
          <FieldDescription>Password must be at least 8 characters long.</FieldDescription>
        </Field>
      </Fieldset>
    </div>
  )
}
