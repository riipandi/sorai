import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldDescription, FieldError, FieldLabel } from '#/components/selia/field'
import { Input } from '#/components/selia/input'

const meta = {
  title: 'Components/Field',
  component: Field,
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
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='w-full min-w-md lg:w-6/12'>
      <Field>
        <FieldLabel htmlFor='name'>Name</FieldLabel>
        <Input id='name' placeholder='Enter your name' required />
        <FieldError match='valueMissing'>This is required</FieldError>
        <FieldDescription>Try to input something, clear it and leave the field.</FieldDescription>
      </Field>
    </div>
  )
}
