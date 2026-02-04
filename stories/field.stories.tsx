import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldDescription, FieldError, FieldLabel } from '#/components/field'
import { Input } from '#/components/input'
import {
  Select,
  SelectPopup,
  SelectItem,
  SelectList,
  SelectTrigger,
  SelectValue
} from '#/components/select'

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
        <FieldLabel htmlFor='name'>Wizard Name</FieldLabel>
        <Input id='name' placeholder='Enter your wizard name' required />
        <FieldError match='valueMissing'>This is required</FieldError>
        <FieldDescription>Try to input something, clear it and leave the field.</FieldDescription>
      </Field>
    </div>
  )
}

export const Controlled: Story = {
  args: {},
  render: () => (
    <div className='w-full'>
      <Field>
        <FieldLabel htmlFor='name'>Select Book</FieldLabel>
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            <SelectList>
              <SelectItem value='da-vinci'>The Da Vinci Code</SelectItem>
              <SelectItem value='angels-demons'>Angels & Demons</SelectItem>
              <SelectItem value='sorcerers-stone'>The Sorcerer's Stone</SelectItem>
            </SelectList>
          </SelectPopup>
        </Select>
      </Field>
    </div>
  )
}
