import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Field, FieldLabel } from '#/components/selia/field'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea
} from '#/components/selia/number-field'

const meta = {
  title: 'Components/NumberField',
  component: NumberField,
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
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Field>
      <NumberField defaultValue={1} min={1} max={1000}>
        <NumberFieldScrubArea>
          <FieldLabel>Instances</FieldLabel>
        </NumberFieldScrubArea>
        <NumberFieldGroup>
          <NumberFieldDecrement>
            <Lucide.MinusIcon />
          </NumberFieldDecrement>
          <NumberFieldInput />
          <NumberFieldIncrement>
            <Lucide.PlusIcon />
          </NumberFieldIncrement>
        </NumberFieldGroup>
      </NumberField>
    </Field>
  )
}
